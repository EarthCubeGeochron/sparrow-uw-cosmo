import pymysql
import paramiko
import pandas as pd
from paramiko import SSHClient
from sshtunnel import SSHTunnelForwarder
from os.path import expanduser
from iced_config import *
from datetime import datetime
from sparrow.import_helpers import BaseImporter
import sqlalchemy
import math

@sparrow.task()
def load_ice_d(redo: bool = False, recreate_thumbnails: bool = False):


    # data transferred from the ice-d
    iced_metadata = pd.DataFrame()
    iced_analytical_data = pd.DataFrame()
    iced_boulder_h = pd.DataFrame()
    calc_ages = pd.DataFrame()

    with SSHTunnelForwarder((ssh_host, ssh_port), ssh_username=ssh_user, ssh_pkey=mypkey, remote_bind_address=(sql_hostname, sql_port)) as tunnel:
        conn = pymysql.connect(host='127.0.0.1', user=sql_username,
            passwd=sql_password, db=sql_main_database,
            port=tunnel.local_bind_port)

        query = '''SELECT * FROM samples
                   WHERE samples.sample_name in (SElECT sample_name FROM Be10_Al26_quartz)'''
        iced_metadata = pd.read_sql_query(query, conn)

        query = '''SELECT * FROM Be10_Al26_quartz'''
        iced_analytical_data = pd.read_sql_query(query, conn)

        query = '''SELECT * FROM samples_user_data'''
        iced_boulder_h = pd.read_sql_query(query, conn)

        query = '''SELECT * FROM calculated_ages'''
        calc_ages = pd.read_sql_query(query, conn)

        conn.close()
        cnx.close()


    iced_metadata.join(iced_analytical_data, on='sample_name', how='left', lsuffix='', rsuffix='', sort=False)
    iced_boulder_h = iced_boulder_h[iced_boulder_h["field_name"].isin(["boulder_height_m"])]
    iced_metadata.join(iced_boulder_h, on='sample_name', how='left', lsuffix='', rsuffix='h_', sort=False)
    iced_metadata.join(calc_ages, on='sample_name', how='left', lsuffix='', rsuffix='', sort=False)

    #pd.dump  table
    # SKIP NETWORK REQUEST/REFETCH DATA

    return iced_metadata

class iced_importer(BaseImporter):
    #authority = "Cosmo Lab"

    def import_row(self, row):
        """
        The cosmo case is kinda weird because there tends to be one
        analysis -> session -> sample
        for each measurement, so it is unclear where to put various
        data points. For instance, elevation could be a sample parameter
        or analysis parameter.
        """
        def checknan(data):
            if math.isnan(data):
                data = None
            return data

        try:
            at = self.models.vocabulary_analysis_type(id='Sample measurements')
            self.db.session.add(at)
            self.db.session.commit()
        except sqlalchemy.exc.IntegrityError:
            self.db.session.rollback()

        sample = self.sample(name=row.loc['id'])
        lon = row.loc['lon_DD']
        lat = row.loc['lat_DD']
        sample.location = self.location(lon, lat)
        sample.elevation=checknan(row.loc['elv_m'])

        #added fields
        if not row.loc['Be10_std']:
            sample.ams_standard = row.loc['Al26_std']
        else:
            sample.ams_standard = row.loc['Be10_std']
        sample.compile = row.loc['collected_by']
        sample.reference = 'Ice-D'
        sample.thickness = checknan(row.loc['thick_cm'])
        sample.sample_name = row.loc['sample_name']
        sample.sample_type = row.loc['what']
        sample.boulder_height = checknan(row.loc['h_field_value'])
        lab_name=row.loc['chem_lab']
        if math.isnan(lab_name):
            lab_name = None
        sample.lab_name = lab_name

        meas = self.models.session()
        #nuclide = row.loc['Nuclide']
        meas.technique = self.method(f"cosmogenic nuclide dating").id
        meas.material = self.material(row.loc['lighology']).id
        meas.date = datetime(row.loc['date_collected'])

        # These two are equivalent
        meas.sample_id = sample.id
        # meas._sample = sample
        self.db.session.add(meas)
        self.db.session.commit()

        self.measured_parameters(meas, row)

        self.db.session.commit()

    def measured_parameters(self, meas, row):

        if not row.loc['qtz_Al_ppm']:
            nuclide = "Be10"
        else:
            nuclide = "Be10 and Al26"

        analysis = self.m.analysis(
            analysis_type='Sample measurements',
            is_interpreted=False)

        analysis.material = self.material(nuclide).id

        analysis._session = meas

        self.db.session.commit()

        dc = []

        v = row.loc['thick_cm']
        val = self.datum(analysis, "Thickness", v, unit='cm')
        dc.append(val)

        v = row.loc['density']
        val = self.datum(analysis,"Density", v, unit='g/cm^3')
        dc.append(val)

        v = row.loc['shielding']
        val = self.datum(analysis,"Shielding", v)
        dc.append(val)

        age = row.loc['t_LSDn']
        age_unc = row.loc['dtint_LSDn']

        val = self.datum(analysis, 'Publ-Age', age_be, error=age_be_unc, unit='years')
        dc.append(val)

        analysis.datum_collection = dc

        self.db.session.commit()

        return analysis

    def model_output(self, meas, row):
        nuclide = row.loc['Nuclide']

        analysis = self.models.analysis(
            analysis_type='CRONUS model output',
            is_interpreted=True)
        analysis.material = self.material(nuclide).id
        for k in ['St', 'Lm', 'LSDn']:
            v = row.loc[k+'_Age']
            e = row.loc[k+'_Exterr']
            d = self.datum(analysis, k+"_Age", v,
                error=e, unit='yr',
                error_metric='absolute',
                is_computed=True,
                is_interpreted=True)
            # Special row for interror
            d.interror = row.loc[k+'_Interr']
        analysis._session = meas
        #analysis.session_id = meas
        self.db.session.add(analysis)
        return analysis


def import_datafile(db = sparrow.get_database(), df=load_ice_d(), csv = False):

    importer = iced_importer(db)
    for ix, row in df.iterrows():
        importer.import_row(row)
        print(row)

    return True

    # db = sparrow.get_database()
    # db.exec_sql_file(...)

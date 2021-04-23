from pandas import read_excel
from datetime import datetime
from sparrow.import_helpers import BaseImporter
import sqlalchemy

class CosmoImporter(BaseImporter):
    authority = "Cosmo Lab"
    def import_row(self, row):
        """
        The cosmo case is kinda weird because there tends to be one
        analysis -> session -> sample
        for each measurement, so it is unclear where to put various
        data points. For instance, elevation could be a sample parameter
        or analysis parameter.
        """

        # Bugfix: manually set analysis type
        try:
            at = self.models.vocabulary_analysis_type(id='Sample measurements')
            self.db.session.add(at)
            self.db.session.commit()
        except sqlalchemy.exc.IntegrityError:
            self.db.session.rollback()

        sample = self.sample(name=row.loc['Sample-ID'])
        lon = row.loc['Long(DD)']
        lat = row.loc['Lat(DD)']
        sample.location = self.location(lon, lat)
        sample.elevation=row.loc['Elev(masl)']

        #added fields
        sample.lab_name=row.loc['Lab']
        sample.lab_standard=row.loc['Lab-Std']
        sample.lab_date=row.loc['Lab_date']
        sample.embargo_name=row.loc['Embargo_date']
        sample.atm_pressure=row.loc['Atm-Pressure']

        meas = self.models.session()
        #nuclide = row.loc['Nuclide']

        meas.technique = self.method(f"cosmogenic nuclide dating").id
        meas.material = self.material(row.loc['Sample-type']).id
        meas.date = datetime(year=row.loc['Sampl-year'], month=1, day=1)

        # These two are equivalent
        meas.sample_id = sample.id
        # meas._sample = sample

        self.db.session.add(meas)

        self.measured_parameters(meas, row)
        #self.model_output(session, row)

        self.db.session.commit()

    # Be and Al importer
    def measured_parameters(self, meas, row):

        if row.loc['26Al-conc(at/g)'] == 0:
            nuclide = "Be10"
        else:
            nuclide = "Be10 and Al26"

        analysis = self.models.analysis(
            analysis_type='Sample measurements',
            is_interpreted=False)

        analysis.material = self.material(nuclide).id

        # self.db.session.commit()

        dc = []

        v = row.loc['Thickn(cm)']
        val = self.datum(analysis, "Thickness", v, unit='cm')
        dc.append(val)

        # v = row.loc['Density(g/cm3)']
        # val = self.datum(analysis,"Density", v, unit='g/cm^3')
        # dc.append(val)

        # v = row.loc['Shield']
        # val = self.datum(analysis,"Shielding", v)
        # dc.append(val)
        #
        # v = row.loc['Erosion']
        # val = self.datum(analysis,"Erosion", v)
        # dc.append(val)

        # v_be = row.loc['10Be-conc(at/g)']
        # e_be = row.loc['10Be-unc(at/g)']
        # v_al = row.loc['26Al-conc(at/g)']
        # e_al = row.loc['26Al-unc(at/g)']
        # if v_al == 0:
        #     val = self.datum(analysis, 'Be-concent', v_be, error=e_be, unit='at/g')
        #     dc.append(val)
        # else:
        #     val = self.datum(analysis, 'Be-concent', v_be, error=e_be, unit='at/g')
        #     dc.append(val)
        #     val = self.datum(analysis, 'Al-content', v_al, error=e_al, unit='at/g')
        #     dc.append(val)
        #
        # age_be = row.loc['Publ-10-age(yr)']
        # age_be_unc = row.loc['Publ-10-unc(yr)']
        # age_al = row.loc['Publ-26-age(yr)']
        # age_al_unc = row.loc['Publ-26-unc(yr)']
        # if isinstance(age_be, int) and isinstance(age_al, int):
        #     val = self.datum(analysis, 'Publ-Be10-Age', age_be, error=age_be_unc, unit='years')
        #     dc.append(val)
        #     val = self.datum(analysis, 'Publ-Al26-Age', age_al, error=age_al_unc, unit='years')
        #     dc.append(val)
        # elif isinstance(age_be, int):
        #     val = self.datum(analysis, 'Publ-Be10-Age', age_be, error=age_be_unc, unit='years')
        #     dc.append(val)
        #     val = self.datum(analysis, 'Publ-Al26-Age', 0, error=0, unit='years')
        #     dc.append(val)
        # else:
        #     val = self.datum(analysis, 'Publ-Be10-Age', 0, error=0, unit='years')
        #     dc.append(val)
        #     val = self.datum(analysis, 'Publ-Al26-Age', 0, error=0, unit='years')
        #     dc.append(val)
        #
        # v = row.loc['Publication'] + '; source: http://expage.github.io/data.html'
        # val = self.datum(analysis,"Data source", v)
        # dc.append(val)

        analysis.datum_collection = dc

        analysis._session = meas
        #analysis.session_id = 1
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

def import_datafile(db, fn):

    # for the different tabs -- pandas

    input = read_excel(fn, sheet_name=0, index_col=0, header=0)
    # output = read_excel(fn, sheet_name=1, index_col=0, header=0)

    # join the above data frames into one

    # df = input.join(output, rsuffix="out").reset_index()

    df = input

    #import IPython; IPython.embed()
    #raise

    importer = CosmoImporter(db)
    for ix, row in df.iterrows():
        importer.import_row(row)
        print(row)

    return True

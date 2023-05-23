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
from sparrow import Database
import psycopg2

"""
A.1. Sample name. Same as version 2 - a text string not exceeding 24 characters. Can include letters, numbers, and dashes (hyphens). May not contain white space or anything that even vaguely resembles an escape character, e.g., slashes of either direction, commas, quotes, colons, or semicolons.
A.2. Latitude. Same as version 2. Decimal degrees: north positive, south negative.
A.3. Longitude. Same as version 2. Decimal degrees: east positive, west negative.
A.4. Elevation/pressure. Same as version 2: meters or hPa, depending on selection below.
A.5. Elevation/pressure handling flag. Same as version 2; this is a three-letter text string. If you have supplied elevations in meters and the default elevation/pressure relationship (currently a spatially variable scheme based on the ERA-40 reanalysis, courtesy of Nat Lifton) is applicable at your site, enter "std" here. If you have supplied elevations in meters, your site is in Antarctica, and you want to use an Antarctic-specific elevation/pressure relationship, enter "ant" here. If you have entered pressure in hPa, enter "pre" here. Any text other than these three options will cause an error.
A.6. Sample thickness. Same as version 2. Centimeters.
A.7. Sample density. Same as version 2. Grams per cubic centimeter.
A.8. Shielding correction. Same as version 2; a shielding factor between 0 and 1.
A.9. Erosion rate inferred from independent evidence. Same as version 2. Centimeters per year.
A.10. Date of sample collection. This is not in version 2. The idea here is so that paleomagnetic reconstructions for the last couple of hundred years are correctly aligned with the date the sample was collected. Of course, this issue is totally irrelevant for samples that are more than a few hundred years old, and it's probably irrelevant for young samples too. In any case, you only need to worry about this at all if you have really young samples. Thus, you can also enter zero and a default date of 2010 will be assumed.
A.11. Then the line ends with a semicolon.
B.1.1 Sample name. This must exactly match the sample name of the corresponding sample as entered in the sample data line, or else, obviously, the code will not be able to match samples to nuclide concentration measurements.
B.1.2. and B.1.3. Nuclide-mineral pair. For Be-10 in quartz, enter "Be-10" and "quartz"; for Al-26 in quartz, this is "Al-26" and "quartz."
B.1.4. and B.1.5. Nuclide concentration and uncertainty. Atoms per gram. Standard or scientific notation.
B.1.6. Name of Be-10 or Al-26 standardization.
B.1.7. Then the line ends with a semicolon.
"""

@sparrow.task()
def cal(redo: bool = False, recreate_thumbnails: bool = False):
    db = Database()

    def get_one_sample(sample_name):

        #SELECT * FROM table WHERE...

        querystring_metadata =  "SELECT " + str(sample_name) + " FROM sample"
        querystring_datum =  "SELECT " + str(sample_name) + " FROM datum"
        querystring_session =  "SELECT " + str(sample_name) + " FROM session"
        querystring_analysis =  "SELECT " + str(sample_name) + " FROM analysis"


        df_metadata = pd.read_sql_query(querystring_metadata, db)
        df_datum = pd.read_sql_query(querystring_datum, db)
        df_session = pd.read_sql_query(querystring_session, db)
        df_analysis = pd.read_sql_query(querystring_analysis, db)

        lon = pd.df_metadata.loc[:,"location"][0]
        lat = pd.df_metadata.loc[:,"location"][1]
        elevation = pd.df_metadata.loc[:,"elevation"]
        flag = pd.df_metadata.loc[:,"pressure_flag"]
        thickness = pd.df_metadata.loc[:,"thickness"]
        get_density = df_metadata[df_metadata["type"] =="desity"]
        density = pd.get_density.loc[:,"value"]
        get_shielding = df_metadata[df_metadata["type"] =="shielding"]
        shielding = pd.get_density.loc[:,"value"]
        year =  pd.df_metadata.loc[:,"date"].year
        pair = "Be-10   Quartz"
        get_nuc = df_metadata[df_metadata["type"] =="Be-concent"]
        concentration = pd.get_nuc.loc[:,"value"]
        uncertainty = pd.get_nuc.loc[:,"error"]
        std  = pd.df_density.loc[:,"standard_id"]

        line1 = str(sample_name)+"    "+lat+"     "+lon+"     "+elevation+"    "+flag+"    "+thickess+"    "+density+"    "+shielding+"    "+year+";"
        line2 = str(sample_name)+"    "+pair+"     "+concentration+"    "+uncertainty+"    "+std+";"
        output = line1 +"\n"+ line2

        return output

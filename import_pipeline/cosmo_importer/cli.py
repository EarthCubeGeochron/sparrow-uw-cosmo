from os import environ
from click import command, option, echo, secho, style
from pathlib import Path
from sparrow import Database
from sparrow.import_helpers import SparrowImportError
from sparrow.util import working_directory
from sparrow.plugins import SparrowPlugin
from .import_data import import_datafile
import os

@command()
def cosmo_command(stop_on_error=False, verbose=False):
    """
    Import cosmogenic nuclide XLSX files
    """
    varname = "SPARROW_DATA_DIR"
    env = environ.get(varname, None)
    if env is None:
        v = style(varname, fg='cyan', bold=True)
        echo(f"Environment variable {v} is not set.")
        secho("Aborting", fg='red', bold=True)
        return
    path = Path(env)
    assert path.is_dir()

    #return

    db = Database()

    #Temporary
    print("Removing old data")
    db.engine.execute("TRUNCATE TABLE datum CASCADE;")
    db.engine.execute("TRUNCATE TABLE datum_type CASCADE;")
    db.engine.execute("TRUNCATE TABLE analysis CASCADE;")
    db.engine.execute("TRUNCATE TABLE session CASCADE;")
    db.engine.execute("TRUNCATE TABLE sample CASCADE;")

    files = path.glob("**/*.xlsx")
    for f in files:
        if f.stem.startswith('~$'):
            continue
        print(f)
        import_datafile(db,f)

# https://github.com/EarthCubeGeochron/Sparrow/blob/master/backend/sparrow/ext/pychron/__init__.py
class CosmoBulkImportPlugin(SparrowPlugin):
    name = "cosmo-bulk-importer"

    def on_setup_cli(self, cli):
        cli.add_command(cosmo_command)
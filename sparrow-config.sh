cosmo="${SPARROW_CONFIG_DIR:-${0:h}}"

# This is only necessary if another instance of `sparrow`
# is the default on your system.
export SPARROW_PATH="$cosmo/Sparrow"

export SPARROW_SECRET_KEY="OrangeTree2019222"
export MAPBOX_API_TOKEN="pk.eyJ1IjoiZGF2ZW5xdWlubiIsImEiOiJjanZ1eWwxMjAwNmRvM3lzNTNqN2d0OHdzIn0.kmDqABs8gHCaihj8UdnQKg"

export SPARROW_LAB_NAME="Cosmogenic Nuclides Lab"
export COMPOSE_PROJECT_NAME="UWCosmo"
export SPARROW_DOMAIN="sparrow-cosmo.geoscience.wisc.edu"

pipeline="$cosmo/import_pipeline"

export SPARROW_DATA_DIR="$cosmo/test-data"

# For now, we keep importer in main repository
export SPARROW_COMMANDS="$pipeline/bin"
export SPARROW_INIT_SQL="$pipeline/sql"

# Sparrow node-side plugins
export SPARROW_SITE_CONTENT="$cosmo/site-content"
# A python module that contains Sparrow Python-side plugins
export SPARROW_PLUGIN_DIR="$cosmo/backend-plugins"

export SPARROW_BACKUP_DIR="$PROJECT_DIR/backups"

if [ -f "$cosmo/sparrow-config.overrides.sh" ]; then
	source "$cosmo/sparrow-config.overrides.sh"
fi

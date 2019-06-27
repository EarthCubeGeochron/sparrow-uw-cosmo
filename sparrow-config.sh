

export SPARROW_SECRET_KEY="OrangeTree2019222"
export SPARROW_LAB_NAME="Cosmogenic Nuclides Lab"
export COMPOSE_PROJECT_NAME="UWCosmo"

cosmo="/Users/yeshan/Documents/github/sparrow-uw-cosmo"
pipeline="$cosmo/import_pipeline"

export SPARROW_DATA_DIR="$pipeline/test-data"

# For now, we keep importer in main repository
export SPARROW_COMMANDS="$pipeline/bin"
export SPARROW_INIT_SQL="$pipeline/sql"

export SPARROW_SITE_CONTENT="$cosmo/site-content"


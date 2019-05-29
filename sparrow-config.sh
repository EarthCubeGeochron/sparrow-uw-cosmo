
project_dir="/projects/cosmo-test-sparrow"

export SPARROW_PATH="$project_dir/Sparrow"
export SPARROW_SECRET_KEY="OrangeTree2019222"
export SPARROW_LAB_NAME="Cosmogenic Nuclides Lab"
export COMPOSE_PROJECT_NAME="CosmoTest"

pipeline="$SPARROW_PATH/import-pipelines/cosmo"

export SPARROW_BACKUP_DIR="$project_dir/db-backups"
export SPARROW_DATA_DIR="$pipeline/test-data"

# For now, we keep importer in main repository
export SPARROW_COMMANDS="$pipeline/bin"
export SPARROW_INIT_SQL="$pipeline/sql"

export SPARROW_BASE_URL="/labs/cosmo-test"
export SPARROW_DB_PORT="51428"
export SPARROW_HTTP_PORT="50102"
export SPARROW_COMPOSE_OVERRIDES="-f $project_dir/docker-compose.overrides.yaml"

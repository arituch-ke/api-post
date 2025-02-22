#!/bin/sh
set -e
set -u

function create_user_and_db() {
  local database=$1
  echo "Creating user and database '$database'"
  psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" <<-EOSQL
		DROP DATABASE IF EXISTS "$database";
		CREATE DATABASE "$database";
		GRANT ALL PRIVILEGES ON DATABASE "$database" TO "postgres";

EOSQL
}

if [ -n "$POSTGRES_MULTIPLE_DATABASES" ]; then
	echo "Multiple database creation requested: $POSTGRES_MULTIPLE_DATABASES"
	for db in $(echo $POSTGRES_MULTIPLE_DATABASES | tr ',' ' '); do
		echo create_user_and_db $db
		create_user_and_db $db
	done
	echo "Multiple databases created"
fi

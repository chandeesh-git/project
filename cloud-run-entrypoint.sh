#!/usr/bin/env bash

# Start the sql proxy
cloud_sql_proxy -instances=inquest-pro-154:us-east4:syn-inquest-pro-154-db-dev=tcp:3306 &
# Execute the rest of your ENTRYPOINT and CMD as expected.
exec "$@"

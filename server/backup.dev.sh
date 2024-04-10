NEXTCLOUD_PASSWORD=$(echo $NEXTCLOUD_PASSWORD | sed 's@\\@@g')
FULL_URL=$NEXTCLOUD_URL/remote.php/dav/files/$NEXTCLOUD_USERID/database_backups/$(date '+%d-%b-%Y')_database.db
curl -u $NEXTCLOUD_USER:$NEXTCLOUD_PASSWORD -T /database.db $FULL_URL
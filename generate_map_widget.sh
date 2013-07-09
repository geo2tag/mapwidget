#!/bin/bash

# Change for your dir
web_server_dir="/var/www/";

# Usage: ./generate_map_widget.sh login password

# This script generates unique map widget from map_template.html with 
# hardcoded credentials, copies it into $web_server_dir

# Before using ensure that $web_server_dir contains 
# geo2tag_requests.js and geo2tag_map_widget.js and server hardcoded in
# map_template.html does allow Access-Control-Allow-Origin (
# http://www.gubatron.com/blog/2011/11/29/lighttpd-allow-access-control-allow-origin-headers-on-the-server-status-page/ )
# because in other cases generated widgets will not work.


function create_random_link(){
	
	rand_link="";
	for i in {1..5}
	do
		rand_str=`od -vAn -N4 -tx < /dev/urandom | grep -o '[^ ]*'`;
   		rand_link=$rand_link$rand_str;
	done	
	
	echo "$rand_link"
}


if [ $# -ne "2" ]
then
  echo "Usage: ./generate_map_widget.sh login password"
  exit 1
fi

login=$1;
password=$2;

link=`create_random_link`;
map_file_name="$web_server_dir/map_$link.html";


cp map_template.html $map_file_name 
sed -i "s/LOGIN_PLACEHOLDER/$login/" $map_file_name 
sed -i "s/PASSWORD_PLACEHOLDER/$password/" $map_file_name

echo $map_file_name

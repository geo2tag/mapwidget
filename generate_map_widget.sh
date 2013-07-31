#!/bin/bash

# Change for your dir
web_server_dir="/var/www/";

# Usage: ./generate_map_widget.sh login password initial_lat initial_lon

# This script generates unique map widgets from map_template.html and map_template_m.html with 
# hardcoded credentials and initial position, copies it into $web_server_dir

# Before using ensure that $web_server_dir contains 
# geo2tag_requests.js and geo2tag_map_widget.js and server hardcoded in
# map_template.html does allow Access-Control-Allow-Origin (
# http://www.gubatron.com/blog/2011/11/29/lighttpd-allow-access-control-allow-origin-headers-on-the-server-status-page/ )
# because in other cases generated widgets will not work.

function replace_placeholders(){

	sed -i "s/LOGIN_PLACEHOLDER/$login/" $1 
	sed -i "s/PASSWORD_PLACEHOLDER/$password/" $1
	sed -i "s/LAT_PLACEHOLDER/$latitude/" $1
	sed -i "s/LON_PLACEHOLDER/$longitude/" $1

	#echo $1
}

function create_random_link(){
	
	rand_link="";
	for i in {1..5}
	do
		rand_str=`od -vAn -N4 -tx < /dev/urandom | grep -o '[^ ]*'`;
   		rand_link=$rand_link$rand_str;
	done	
	
	echo "$rand_link"
}


if [ $# -ne "5" ]
then
  echo "Usage: ./generate_map_widget.sh login password latitude longitude server_name"
  exit 1
fi

login=$1;
password=$2;
latitude=$3;
longitude=$4; 
server_name=$5;

link=`create_random_link`;
map_file_name="$web_server_dir/map_$link.html";
map_file_m_name="$web_server_dir/map_${link}_m.html";


cp map_template.html $map_file_name 
replace_placeholders $map_file_name

cp map_template_m.html $map_file_m_name 
replace_placeholders $map_file_m_name

echo "${server_name}map_${link}.html"
echo "${server_name}map_${link}_m.html"

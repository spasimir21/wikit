FROM docker.elastic.co/elasticsearch/elasticsearch:8.0.1

RUN echo "PASSWORD" | bin/elasticsearch-keystore add -xf bootstrap.password

RUN printf "cluster.name: \"wikit-cluster\"\nnetwork.host: 0.0.0.0\nxpack.security.enabled: true\n" > /usr/share/elasticsearch/config/elasticsearch.yml

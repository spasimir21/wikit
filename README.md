# Wikit

A wiki composed of small, interconnected informational fragments.

# Setup

1. Copy the contents of wikit.hosts to your etc/hosts file
2. Copy the backend/config.template.yml to backend/config.yml
3. Run the install script from the scripts folder
4. Run the build script
5. Run the run script
6. And finally open _http://wikit.eu_ in your browser

# Notes

> The **seed** feature was written for the old version and hasn't been updated since, so the information that it will
> add won't use markup, citations, images and others.

> **Elasticsearch** was replaced last minute by _Neo4j's Full-Text Indexes_ to make the platform a lot faster and easier
> to run. All the documentation still includes it though.

> It's recommended to use _at least_ **2 - 4 GB** of **RAM** for the docker containers.
> ([Docker Windows Guide](https://docs.docker.com/desktop/windows/))

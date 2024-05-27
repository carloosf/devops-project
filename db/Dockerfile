FROM mysql:latest

ENV MYSQL_ROOT_PASSWORD=root_pass
ENV MYSQL_DATABASE=user_crud
ENV MYSQL_USER=carlos
ENV MYSQL_PASSWORD=mysql_pass

COPY ./init.sql /docker-entrypoint-initdb.d/

WORKDIR /docker-entrypoint-initdb.d/

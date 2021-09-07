npm i
echo node installed

if [ -f .env ]
then
  echo 'env file already exists'
else
  touch .env
  echo NODE_ENV = development >> .env
  echo DEBUG = app:* >> .env
  echo it_jwtsecret = randomString >> .env
  echo 'env file created.'
fi



git pull origin master

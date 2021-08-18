if [ -f .env ]
then
  echo 'env file already exists'
else
  touch .env
  echo 'env file created.'
fi

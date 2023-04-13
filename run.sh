echo "hello world"
cd ./front_end/my-app
npm install
npm run build
mv build ../../back_end/public
cd ../../back_end
npm install
npm run dev
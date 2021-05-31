
var firebaseConfig = {
  apiKey: "AIzaSyDAY_APbY1uOqjkB-ZMFvXK6hEbL4b6uvs",
  authDomain: "restorant-24ec0.firebaseapp.com",
  projectId: "restorant-24ec0",
  storageBucket: "restorant-24ec0.appspot.com",
  messagingSenderId: "1022148116939",
  appId: "1:1022148116939:web:15aca28e73cec038b2764e",
  measurementId: "G-QZVJ19KWJV"
};
firebase.initializeApp(firebaseConfig);

var donerList=[];
var kebapList=[];
var firinList=[];
var mesrubatList=[];


const db=firebase.firestore();
const kebapTable=document.getElementById('myListProductsKebap');
const donerTable=document.getElementById('myListProductsDoner');
const firinTable=document.getElementById('myListProductsFirin');
const mesrubatTable=document.getElementById('myListProductsMesrubat');


function setTableItems(list,table) {

list.forEach(function(item){
  var tr=`
  <tr>
      <td><img src="${item.imageUrl}" style="height: 50px; width: 50px;"></td>
      <td>${item.name}</td>
      <td>${item.description}</td>
      <td>${item.preparationTime}</td>
      <td>${item.price}</td>
      <td></td>
      <td></td>
  </tr>
  `;
  table.innerHTML+=tr;
  return table;
});

}


async function getDoners() {
await db.collection('products').onSnapshot(function(querySnapshot){
  querySnapshot.docs[0].data().doner_cesitleri.forEach(item => {
    var e=new Product();
    e.name=item.name;
    e.imageUrl=item.imageUrl;
    e.description=item.description;
    e.price=item.price;
    e.status=item.status;
    e.preparationTime=item.preparationTime;
    donerList.push(e);
  });
})
donerTable= setTableItems(donerList,donerTable);
}

async function getFirins() {
await db.collection('products').onSnapshot(function(querySnapshot){
  querySnapshot.docs[1].data().firin_cesitleri.forEach(item => {
    var e=new Product();
    e.name=item.name;
    e.imageUrl=item.imageUrl;
    e.description=item.description;
    e.price=item.price;
    e.status=item.status;
    e.preparationTime=item.preparationTime;
    firinList.push(e);
  });
})
setTableItems(firinList,firinTable);
}

async function getKebaps() {
await db.collection('products').onSnapshot(function(querySnapshot){
  querySnapshot.docs[2].data().kebap_list.forEach(item => {
    var e=new Product();
    e.name=item.name;
    e.imageUrl=item.imageUrl;
    e.description=item.description;
    e.price=item.price;
    e.status=item.status;
    e.preparationTime=item.preparationTime;
    kebapList.push(e);
  });
})
setTableItems(kebapList,kebapTable);
}

async function getMesrubat() {
await db.collection('products').onSnapshot(function(querySnapshot){
  querySnapshot.docs[3].data().icecek_turleri.forEach(item => {
    var e=new Product();
    e.name=item.name;
    e.imageUrl=item.imageUrl;
    e.price=item.price;
    e.status=item.status;
    mesrubatList.push(e);
  });
})
setTableItems(mesrubatList,mesrubatTable);

}

getDoners();
getFirins();
getKebaps();
getMesrubat();




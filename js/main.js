var orderList=[];

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

const db=firebase.firestore();
//-------//
class DatabaseHelper{
    async getOrder() {
        await db.collection('orders').onSnapshot(function(querySnapshot) {   
            orderList=[];         
            querySnapshot.forEach(function(doc) {
                var data=doc.data();
                var order=new OrderModel();
                order.customerId=doc.id;
                order.nameSurname=doc.data().customerNameSurname;
                order.address={
                    'address': data.address.address,
                    'addressDetails':data.address.addressDetails
                };
                order.totalPrie=data.totalPrice;
                order.customerNote=data.customerNote;
                order.isCancel=data.isCancel;
                order.isMaking=data.isMaking;
                order.isOkkay=data.isOkkay;
                order.isSubmission=data.isSubmission;
                order.paymentType=data.paymentType;
                data.foods.forEach(function(food) {
                    order.foods.push(food);
                });
                order.phoneNumber=data.phoneNumber;
                order.date=data.date

                orderList.push(order)
            });
            
            addToTable(orderList);
            
          });
          
    } 
}
//----//

const table=document.getElementsByTagName('tbody');
const dialogClass=document.getElementById('orderModelContent');


let dbHelper=new DatabaseHelper()

function addToTable(list){
    table[0].innerHTML=[];
    
    list.forEach(function(element) {
        var tr=`
        <tr>
            <td>${element.nameSurname}</td>
            <td>₺ ${element.totalPrie}</td>
            <td>${element.date}</td>
            <td>${element.isOkkay==false?'Onay Bekleniyor':'Onaylandı / Sipariş Hazırlanıyor'}</td>
            <td>${element.paymentType}</td>
            <td>
            <Button class="btn btn-primary" onclick=setIsOkkay('${element.customerId}') ${element.isOkkay==true?'disabled':''} >${element.isOkkay==true?'Onaylandı':'Onayla'}</Button></td>
            <td>
            <button type="button" onclick=setModelDialog('${element.customerId}') class="btn btn-warning" data-bs-toggle="modal" data-bs-target="#OrderDetailsModel">
            Detay
            </button>
            </td>
            <td><Button class="btn btn-danger">İptal Et</Button></td>                       
        </tr>
        ` ;
        table[0].innerHTML+=tr;
    })
}
function setIsOkkay(id) {
    db.collection('orders').doc(id).update({
        'isOkkay':true,
        'isMaking':true,
    })
}
dbHelper.getOrder();










///--- ModelDialog

function setModelDialog(id) {


    var order=new OrderModel();
    
    orderList.forEach(function(element) {
        if(element.customerId==id){
            order=element;
        }
    })

    console.log(order);
    
    var tbody=``;

    order.foods.forEach(function(food) {
        var tr=`
        <tr>
            <td>${food.foodName}</td>
            <td>${food.portion==true?'1-5 Porsiyon':'1 Porsiyon'}</td>
            <td>${food.count} Adet</td>
            <td>${food.price} ₺</td>
        </tr>
        `;
        tbody+=tr;
    })
    

    var dialogModel=`
    <div class="modal-content">
                  <div class="modal-header">
                    <h4 class="modal-title" id="exampleModalLabel">Sipariş Detay</h4>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                  </div>
                  <div class="modal-body">
                    <h5><b>Müşteri Bilgileri</b></h5>
                    Adı Soyadı : ${order.nameSurname} <br>
                    Telefon No : ${order.phoneNumber}
                  </div>
                  <div class="modal-body">
                      <h5>Sipariş Edilen Ürünler</h5>
                      <table class="table table-striped">
                          <thead>
                              <tr>
                                  <th>Yemek Adı</th>
                                  <th>Porsiyon</th>
                                  <th>Adet</th>
                                  <th>Fiyat</th>
                              </tr>
                          </thead>
                          <tbody id=dialogTable>
                              ${tbody}
                          </tbody>
                          <tfoot>
                              <tr>
                                  <td><b>Toplam Ödenecek Tutar</b></td>
                                  <td></td>
                                  <td></td>
                                  <td><b>${order.totalPrie}</b></td>
                              </tr>
                          </tfoot>
                          
                      </table>
                  </div>
                  <div class="modal-body">
                      <h5><b>Adres/Ödeme Bilgileri</b></h5>
                      <b>Adres</b> : ${order.address.address} <br>
                      <b>Adres Detayı</b> : ${order.address.addressDetails} <br><br>
                      <b>Ödeme Yöntemi</b> : ${order.paymentType} <br><br>
                      <b>Müşteri Sipariş Notu</b> : <span style="color:red;">${order.customerNote}</span> <br><br>
                    </div>
                  <div class="modal-footer">
                    <button type="button" class="btn btn-primary" data-bs-dismiss="modal" onclick=setIsOkkay('${order.customerId}') ${order.isOkkay==true?'disabled':''}>${order.isOkkay==true?'Onaylandı':'Onayla'}</button>
                    <button type="button" class="btn btn-danger">İptal Et</button>
                  </div>
                </div>
    `;

    



    OrderDetailsModel.innerHTML=dialogModel;
    
}
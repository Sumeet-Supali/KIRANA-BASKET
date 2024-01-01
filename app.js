// import {add} from "./functions.js"
// console.log(add(2,3));
//db -  https://grocerries-502d7-default-rtdb.firebaseio.com/
// 1) - "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js";
// 2) - "https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js";

//fucntion from link
import {initializeApp} from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js"
import {getDatabase , ref , push , onValue , remove} from "https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js"

// our database url
const appSetting = {
    databaseURL : "https://grocerries-502d7-default-rtdb.firebaseio.com/"
}

//fetching database and conf it
const app = initializeApp(appSetting)
// console.log(app);
const database = getDatabase(app);
// console.log(database);
const fooditems = ref(database,"food items");
// const books = ref(database,"books");

//fetch ele from html
let inp = document.getElementById("input");
let btn = document.getElementById("btn");
let shoplist = document.getElementById("shopping-list");
let itemsadded = document.getElementById("itemsadded");
//fetch data from firebase
onValue(fooditems , function(snapshot){
    if(snapshot.exists()){
        let snapshot_arr = snapshot.val();
        let arr_values = Object.entries(snapshot_arr);
        
        let Total_items = arr_values.length;
        // alert(Total_items)
        
        // console.log(arr_values);
        clear_previous_data();
        show_total_items(Total_items);

        
        for(let i=0;i<arr_values.length;i++){
            let ith_items =  arr_values[i];
            let current_item_name = ith_items[1] ;
            let current_item_id = ith_items[0];
            AddItem_DeleteItem(ith_items);
        }
    }else{
        shoplist.innerHTML = "No Items to show for now....."
        itemsadded.textContent = `Total items - ${0}`;
    }

    
})

function show_total_items(val){
    itemsadded.textContent = `Total items - ${val}`;
}

//clear previous data(booksnames) after updating the database
function clear_previous_data(){
    shoplist.innerHTML = "";
}
//fun to add items to list
function AddItem_DeleteItem(item){

    let current_item_name = item[1] ;
    let current_item_id = item[0];

    //logic to create foodlist

    let new_foodItem = document.createElement("li");
    new_foodItem.innerHTML = current_item_name ;
    shoplist.append(new_foodItem);

    //logic to delete items
    //from firebase

    new_foodItem.addEventListener("click",function(){
        let Item_to_be_removed = ref(database,`food items/${current_item_id}`);
        
        remove(Item_to_be_removed);
    })


}

//fun to clear input field after btn click
function clear_inputfield(){
    inp.value = '';
}

btn.addEventListener("click",function(){
    push(fooditems,inp.value);
    // addditems(inp.value);
    clear_inputfield();
    console.log(`${inp.value} added to database`);
})

//adding image from api
let image = document.getElementById("img");
fetch('https://pixabay.com/api/?key=41530548-951a19786c5c49c45c0508ced&q=food&image_type=photo')
    .then(Response => Response.json())
    .then(data => {
        // console.log(data);
        const image_urls = data.hits.map(hit => hit.largeImageURL);
        let random_index = Math.floor(Math.random()*image_urls.length);

        image.src = image_urls[random_index]; 
    })

//preloader logic
let content = document.getElementById("content");
let preload = document.getElementById("preloader");
setTimeout(() => {
    content.style.opacity = 1;
    preload.style.display = "none";
}, 2000); // 3 sec delay given


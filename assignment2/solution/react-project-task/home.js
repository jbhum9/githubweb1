var TPL_ROW = "";
document.addEventListener("DOMContentLoaded",()=>{
	getTpl();


	document.querySelectorAll("tfoot button")[0].addEventListener("click",addTask);
	document.getElementById("logout").addEventListener("submit",e=>{e.preventDefault();logout();});
});
var addTask = ()=>
{
	let u = getCookie("username");
	let p = getCookie("passwd");

	let desc = document.querySelectorAll("tfoot input")[0].value;
	let postData = `description=${desc}`;
	let url = `${API_URL}`;

	fetch(url,
		{
		"method":"POST",
		//"mode":"cors",
		//"credentials":"same-origin",
		"headers":{
			"Content-Type":"application/x-www-form-urlencoded",
			"Authorization":`Basic ${u}`,
			"Auth-Secret":p,
		},
		"body":postData
	})
	.then(response=>response.json())
	.then(json=>{
		if (json.status == "success")
		{
			location.href = "./home.html";
			return;
		}
		alert("Error occurred");
		throw json;
	})
	.catch(e=>console.log(`Error occurred: ${e}`));

}
var getTasks = ()=>
{
	let u = getCookie("username");
	let p = getCookie("passwd");

	let url = `${API_URL}`;
	fetch(url,
		{
		"method":"GET",
		//"mode":"cors",
		//"credentials":"same-origin",
		"headers":{
			"Content-Type":"application/x-www-form-urlencoded",
			"Authorization":`Basic ${u}`,
			"Auth-Secret":p,
		}
	})
	.then(response=>response.json())
	.then(json=>{
		if (json.status == "fail" && json.data == "authorization")
		{
			alert("You are not authorized to view this page");
			return;
		}
		if(json.data.length > 0)
		{
			let tbody = document.querySelectorAll("tbody")[0];
			tbody.innerHTML = "";

			json.data.map(item=>{

				let tpl = document.createElement("tbody");
				tpl.innerHTML = TPL_ROW;

				let row = tpl.querySelectorAll("tr")[0];

				row.querySelectorAll("input")[0].addEventListener("blur",(e)=>{updateTask(item.id,e.target.value);});
				row.querySelectorAll(".delete")[0].addEventListener("click",()=>deleteTask(item.id));

				if(typeof item.content.description !== "undefined")
				row.querySelectorAll("input")[0].value = item.content.description;

				tbody.appendChild(row);
			});
		}
		else
			document.querySelectorAll("tbody tr td")[0].innerHTML = "You do not have any tasks";
	})
	.catch(e=>console.log(`Error occurred: ${e}`));
}

var getTpl = ()=>
{
	let url = "task-row.html";
	fetch(url)
	.then(response=>response.text())
	.then(text=>{
		TPL_ROW=text;
		getTasks();
	})
	.catch(e=>console.log(`Error occurred: ${e}`));
}

var deleteTask = (id)=>
{

	let u = getCookie("username");
	let p = getCookie("passwd");

	let url = `${API_URL}/${id}`;

	fetch(url,
		{
		"method":"DELETE",
		//"mode":"cors",
		//"credentials":"same-origin",
		"headers":{
			"Content-Type":"application/x-www-form-urlencoded",
			"Authorization":`Basic ${u}`,
			"Auth-Secret":p,
		}
	})
	.then(response=>response.json())
	.then(json=>{
		if (json.status == "success")
		{
			location.href = "./home.html";
			return;
		}
		alert("Error occurred");
		throw json;
	})
	.catch(e=>console.log(`Error occurred: ${e}`));
}
var updateTask = (id,desc)=>
{
	let u = getCookie("username");
	let p = getCookie("passwd");

	let url = `${API_URL}/${id}`;
	let postData = `description=${desc}`;

	fetch(url,
		{
		"method":"PUT",
		//"mode":"cors",
		//"credentials":"same-origin",
		"headers":{
			"Content-Type":"application/x-www-form-urlencoded",
			"Authorization":`Basic ${u}`,
			"Auth-Secret":p,
		},
		"body":postData
	})
	.then(response=>response.json())
	.then(json=>{
		if (json.status == "success")
		{
			console.log(`success update task ${id}`);
			return;
		}
		alert("Error occurred");
		throw json;
	})
	.catch(e=>console.log(`Error occurred: ${e}`));
}

setupUi()
/* GET POSTS FROM IPA */
function getPosts(){

    axios.get("https://tarmeezacademy.com/api/v1/posts")
    .then((response) => {
    const posts = response.data.data
    document.getElementById("posts").innerHTML=""  
    for (post of posts){

        let post_title =""

        if(post.title != null){
            post_title = post.title
        }
        let content = `
        <div class="d-flex justify-content-center mt-4">
            <div class="col-9">
                <div id="post">
                    <div class="card shadow ">
                        <h5 class="card-header">
                            <img class="rounded-circle " src="${post.author.profile_image}" alt="" style="width: 40px; height: 40px;">
                            <span><b> @${post.author.username}</b></span>
                            
                        </h5>
                        <div class="card-body" style="cursor: pointer;" onclick="postClicked(${
                                
                                post.id})" >
                                <img class="w-100 " src="${post.image}" alt="" >
                                <h6 class="mt-1" style="color: gray;">${post.created_at} </h6>
                                <h2>${post_title}</h2>
                                <p> 
                                    ${ post.body}  
                                </p>
                                <hr>
                                <div>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-pen" viewBox="0 0 16 16">
                                        <path d="m13.498.795.149-.149a1.207 1.207 0 1 1 1.707 1.708l-.149.148a1.5 1.5 0 0 1-.059 2.059L4.854 14.854a.5.5 0 0 1-.233.131l-4 1a.5.5 0 0 1-.606-.606l1-4a.5.5 0 0 1 .131-.232l9.642-9.642a.5.5 0 0 0-.642.056L6.854 4.854a.5.5 0 1 1-.708-.708L9.44.854A1.5 1.5 0 0 1 11.5.796a1.5 1.5 0 0 1 1.998-.001zm-.644.766a.5.5 0 0 0-.707 0L1.95 11.756l-.764 3.057 3.057-.764L14.44 3.854a.5.5 0 0 0 0-.708l-1.585-1.585z"/>
                                    </svg>
                                    <span>
                                        (${post.comments_count}) comments
                                        
                                    </span>
                                </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        `
        document.getElementById("posts").innerHTML += content
    }
})
}
getPosts()
/* ===//GET POSTS FROM IPA//=== */

/* ===============LOGEIN MODAL============== */
function LoginClicked(){
    const username = document.getElementById("username-input").value
    const password = document.getElementById("password-input").value
    params={
        "username" : username,
        "password" : password
    }
    axios.post('https://tarmeezacademy.com/api/v1/login',params)
    .then(response => {
        localStorage.setItem("token",response.data.token)
        localStorage.setItem("user",JSON.stringify(response.data.user))
        hideModal("exampleModal")
        showAlert("Login successflly")
        setupUi()
    })
}

/* =========//////LOGEIN MODAL//////======== */

/* ============logout========== */
function logout(){
    localStorage.removeItem("token")
    localStorage.removeItem("user")
    showAlert("Logout successflly","danger")
    setupUi()
}
/* ============/// logout ///========== */

function setupUi(){
    const token = localStorage.getItem('token');
    let logeout =document.getElementById("logout-div")
    let loginDiv = document.getElementById('login-div')
    let postBtn = document.getElementById("creat-post-btn")
    if(token == null){
        if(postBtn != null){
            postBtn.style.setProperty("display","none","important")
        }
        loginDiv.style.setProperty("display","flex","important")
        logeout.style.setProperty("display","none","important")
    }else{
        const user =getCarentUser()
        document.getElementById("nav-username").innerHTML = user.username
        document.getElementById("nav-user-image").src= user.profile_image
        if(postBtn != null){
            postBtn.style.setProperty("display","flex","important")
        }
        loginDiv.style.setProperty("display","none","important")
        logeout.style.setProperty("display","flex","important")
    }
}

/* ===========show alert & and hide bootstrap  modal ============ */
function showAlert(message, type="success"){
    const alertPlaceholder = document.getElementById('liveAlertPlaceholder')
    const appendAlert = (message, type) => {
    const wrapper = document.createElement('div')
    wrapper.innerHTML = [
        `<div class="alert alert-${type} alert-dismissible" role="alert">`,
        `   <div>${message}</div>`,
        '   <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>',
        '</div>'
    ].join('')
    alertPlaceholder.append(wrapper)
    }
    appendAlert(message, type)
    
}

/*hide the MODAL of bootstrap  */
function hideModal(id){
    const modal = document.getElementById(id)
    const modalInstanse = bootstrap.Modal.getInstance(modal)
    modalInstanse.hide()
}

/* ===========///show alert & and hide bootstrap  modal////============ */

/* ============ REGISTER REQUEST ========= */
function registerClicked(){
    const name = document.getElementById("register-name-input").value
    const username = document.getElementById("register-username-input").value
    const imagePost = document.getElementById("register-profil-input").files[0]
    const password = document.getElementById("register-password-input").value

    // CREAT REQUEST ON AXIOS
    let formData = new FormData()
    formData.append("username",username)
    formData.append("name",name)
    formData.append("image",imagePost)
    formData.append("password",password)
    axios.post('https://tarmeezacademy.com/api/v1/register',formData )
    .then(response => {
        localStorage.setItem("token",response.data.token)
        localStorage.setItem("user",JSON.stringify(response.data.user))
        showAlert("Register seccessflly")
    }).catch(error => {
        msgOfError =  String (error.response.data.message)
        showAlert(msgOfError,"danger")
    })
        hideModal("registertModal")   
    }
/* ==========//// REGISTER REQUEST //// ========= */

/* ===========CREAT POST BTN========== */
function creatPostClicked(){
    let  token = localStorage.getItem("token")
    titlePost = document.getElementById("creat-title-input").value
    bodyPost = document.getElementById("creat-body-input").value
    imagePost = document.getElementById("creat-image-input").files[0]
    
    const headers ={
        "authorization":`Bearer ${token}`
    }


    // CREAT REQUEST ON AXIOS
    let formData = new FormData()
    formData.append("title",titlePost)
    formData.append("body",bodyPost)
    formData.append("image",imagePost)
    axios.post('https://tarmeezacademy.com/api/v1/posts',formData ,{
        headers: headers
    })
    .then(response => {
        showAlert("post has been created with seccsse")
        hideModal("creatPstModal")
        getPosts()
    }).catch((error) => {
        msgOfError =  String (error.response.data.message)
        showAlert(msgOfError,"danger")
    })
    
    

}
/* ===========///// CREAT POST BTN /////========== */

/* ===========GET USERS FROM LOCALE STORIGE FOR NAV-USERMANE========== */
function getCarentUser(){
    let user = null
    const  localStogageUser = localStorage.getItem("user")
    if(localStogageUser != null){
        user = JSON.parse(localStogageUser)
        
        return user
    }
}
/* ===========//GET USERS FROM LOCALE STORIGE FOR NAV-USERMANE//========== */

// ============================================================================== PAGE 2 ===============================================================//

/* =================POST CLICKED===================== */
function postClicked(id){
    
    window.location = `diteilspage.html?id=${id}` 


}


/* =================/// POST CLICKED ///===================== */
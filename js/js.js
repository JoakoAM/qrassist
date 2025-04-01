

function session() {
    console.log('Verificando sesión...');
    document.body.style.cursor = 'wait'; // Cambiar el cursor a espera
    document.body.style.display = 'none';
    xhr = new XMLHttpRequest();
    xhr.open('POST', 'php/session.php', true);
    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
    xhr.onreadystatechange = function () {
        if (xhr.readyState === XMLHttpRequest.DONE) {
            if (xhr.status === 200) {
                try {
                    console.log('Respuesta sv:', xhr.responseText); // Imprimir la respuesta completa
                    const response = JSON.parse(xhr.responseText);
                    if (response.message === 'sesion activa') {
                        console.log('Sesión iniciada');
                        document.body.style.cursor = 'default'; // Restaurar el cursor
                        document.body.style.display = 'block';
                    } else if (response.message === 'sesion inactiva') {
                        console.log('Sesión no iniciada');
                        window.location.href = '/';
                    } else {
                        console.error('Mensaje desconocido:', response.message);
                        alert('Mensaje desconocido: ' + response.message);
                    }
                } catch (e) {
                    console.error('Error al parsear la respuesta JSON:', e);
                    //alert('Error al parsear la respuesta JSON. Por favor, inténtelo de nuevo.');
                }
            } else {
                console.error('Error en la solicitud:', xhr.status, xhr.statusText);
                //alert('Error en la solicitud. Por favor, inténtelo de nuevo.');
            }
        }

    }
    xhr.send();
};
//let inactivityTime = function () {
//    let time; // Variable para el temporizador
//    const fiveMinutes = 300000; // 5 minutos en milisegundos (300,000 ms)

    // Función para ejecutar después de 5 minutos de inactividad
    //function logout() {
    //    alert("Has estado inactivo durante 5 minutos. Serás redirigido.");
    //    const xhr = new XMLHttpRequest();
    //    xhr.open('POST', 'php/logout.php', true);
    //    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
    //    xhr.onreadystatechange = function () {
    //        if (xhr.readyState === XMLHttpRequest.DONE) {
    //            if (xhr.status === 200) {
    //                try {
    //                    console.log('Respuesta sv:', xhr.responseText);
    //                    const response = JSON.parse(xhr.responseText);
    //                    if (response.message === 'sesion cerrada') {
    //                        window.location.href = '/'; // Redirigir a la página de cierre de sesión
    //                    } else {
    //                        console.error('Mensaje desconocido:', response.message);
    //                        alert('Mensaje desconocido: ' + response.message);
    //                    }
    //                } catch (e) {
    //                    console.error('Error al parsear la respuesta JSON:', e);
    //                    //alert('Error al parsear la respuesta JSON. Por favor, inténtelo de nuevo.');
    //                }
    //            } else {
    //                console.error('Error en la solicitud:', xhr.status, xhr.statusText);
    //                //alert('Error en la solicitud. Por favor, inténtelo de nuevo.');
    //            }
    //        }
    //    }
    //    xhr.send();
    //}
//

//    // Reinicia el temporizador cada vez que hay actividad
//    function resetTimer() {
//        clearTimeout(time); // Limpia el temporizador anterior
//        time = setTimeout(logout, fiveMinutes); // Inicia un nuevo temporizador
//    }
//
//    // Detectar eventos de actividad del usuario
//    window.onload = resetTimer;
//    document.onmousemove = resetTimer;
//    document.onkeypress = resetTimer;
//    document.onscroll = resetTimer;
//    document.onclick = resetTimer;
//    document.onkeydown = resetTimer;
//    //resetTimer(); // Llama a resetTimer inicialmente
//};

function datospatente(patente, callback) {
    const options = { method: 'GET', headers: { accept: 'application/json' } };
    fetch('https://api.boostr.cl/vehicle/fake/' + patente + '.json', options)
        .then(res => res.json())
        .then(res => {
            console.log('Response JSON:', res);
            const data = res.data;
            const marca = data.make;
            const modelo = data.model;
            console.log('Marca:', marca);
            console.log('Modelo:', modelo);
            // Llamar al callback pasando los datos obtenidos
            callback(marca, modelo);
        })
        .catch(err => {
            console.error('Error al obtener datos de la patente:', err);
            callback(null, null);
        });
}

function validarpatente(patente) {
    // Convierte la patente a mayúsculas para hacer una comparación insensible a mayúsculas y minúsculas
    const patenteUpper = patente.toUpperCase();
    // Expresiones regulares para los diferentes formatos de patente
    const formatoAntiguo = /^[A-Z]{2}\d{4}$/;  // Ejemplo: AB1234
    const formatoNuevo = /^[B-Z]{2}[A-Z]{2}\d{2}$/;  // Ejemplo: BBCC10

    // Verificar si la patente cumple con alguno de los formatos
    if (formatoAntiguo.test(patenteUpper) || formatoNuevo.test(patenteUpper)) {
        return true; // Patente válida
    } else {
        return false; // Patente inválida
    }

}

//function handlePageLoad() {
//    if (window.location.pathname !== '/' && window.location.pathname !== "/index.html") {
//        console.log('Iniciando verificación de sesión...');
//        console.log('Path permitido, ejecutando session()');
//        session();
//        inactivityTime();
//    }
//}

////if (//window.onload !== '/' && window.onload !== "/index.html") {
//    window.onload = handlePageLoad();
////}
//
//////if (//window.onpopstate !== '/' && window.onpopstate !== "/index.html") {
//    window.onpopstate = handlePageLoad();
////}


// Reiniciar el temporizador de inactividad
function resetTimer() {
    clearTimeout(time);
    time = setTimeout(logout, fiveMinutes);
}

if (window.location.pathname === '/' || window.location.pathname === '/index.html') {
    $("#alertreg").hide();
    $("#alerturs").hide();
    $("#alertpass").hide();
    $("#alertusr").hide();
    $("#alertusr2").slideUp();
    setTimeout(() => {
        $("#alertreg").slideUp();
        $("#alerturs").slideUp();
        $("#alertpass").slideUp();
        $("#alertusr").slideUp();
        $("#alertusr2").slideUp();
    }, 3000);
    const rutlog = document.getElementById('rutlog');
    const submitButton = document.getElementById('buttonlog');
    submitButton.disabled = true;
    rutlog.addEventListener('blur', function () {
        const rutlogValue = rutlog.value;
        const a = formatearRUT(rutlogValue);
        const containsHyphen = /-/.test(rutlogValue); // Verificar si contiene un guion
        const containspoints = /\./.test(rutlogValue); // Verificar si contiene un punto
        const containsminus = /[a-z]/.test(rutlogValue); // Verificar si contiene mayusculas
        if (!validarRUT(a) || containsHyphen || containspoints || containsminus) {
            $("#rutMessagelog").slideDown();
            submitButton.disabled = true; // Desactivar el botón si no es válido o contiene un guion
        } else {
            $("#rutMessagelog").slideUp();
            submitButton.disabled = false;
            // Activar el botón si es válido y no contiene un guion
            submitButton.addEventListener('click', function () {
                xhr = new XMLHttpRequest();
                xhr.open('POST', 'php/validacion.php', true);
                xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
                xhr.onreadystatechange = function () {
                    if (xhr.readyState === XMLHttpRequest.DONE) {
                        if (xhr.status === 200) {
                            try {
                                console.log('Respuesta sv:', xhr.responseText); // Imprimir la respuesta completa
                                const response = JSON.parse(xhr.responseText);
                                if (response.message === 'Usuario valido') {
                                    window.location.href = '/?status=secret';
                                } else if (response.message === 'Usuario no validado') {
                                    $("#alertpass").slideDown();
                                    setTimeout(() => {
                                        $("#alertpass").slideUp();
                                    }, 3000);
                                } else if (response.message === 'lector valido') {
                                    window.location.href = '/lector.html?status=lectorsus';
                                }
                            } catch (e) {
                                //console.error('Error al parsear la respuesta JSON:', e);
                            }
                        }
                    }
                }
                const c = limpiar(a);
                const cifred = cifrar(c);
                const cifred2 = cifrar(document.getElementById('passlog').value);
                xhr.send('aasd=' + encodeURIComponent(cifred) + '&ddd=' + encodeURIComponent(cifred2));
            });
        }
    });
    function cifrar(texto) {
        var cifrado = btoa(texto);
        return cifrado;

    }
    function limpiar(a) {
        return a.replace(/[\.\-]/g, '');
    }
    const urlParams = new URLSearchParams(window.location.search);
    const status = urlParams.get('status');
    if (!urlParams.has('status')) {
        document.getElementById('login').style.display = 'block';
    } else if (status === 'secret') {
        document.getElementById('login').style.display = 'none';
        document.getElementById('secretform').style.display = 'block';
        const botonsecret = document.getElementById('botonsecret');
        botonsecret.addEventListener('click', () => {
            const secretinp = document.getElementById('secret');
            const secret3 = cifrar(secretinp.value);
            const xhr = new XMLHttpRequest();
            xhr.open('POST', 'php/secret.php', true);
            xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
            xhr.onreadystatechange = function () {
                if (xhr.readyState === XMLHttpRequest.DONE) {
                    if (xhr.status === 200) {
                        try {
                            console.log('Respuesta sv:', xhr.responseText); // Imprimir la respuesta completa
                            if (xhr.responseText.trim() === "") {
                                console.error('La respuesta del servidor está vacía');
                                return;
                            }
                            const response = JSON.parse(xhr.responseText);
                            if (response.message === 'palabra correcta') {
                                window.location.href = '/lector.html?status=us';
                            } else if (response.message === 'palabra incorrecta') {
                                $("#alertbadsecret").slideDown();
                                //console.log('Palabra incorrecta');
                                setTimeout(() => {
                                    $("#alertbadsecret").slideUp();
                                }, 3000);
                            } else {
                                console.log('Mensaje desconocido:', response.message);
                                //alert('Mensaje desconocido: ' + response.message);
                            }
                        } catch (e) {
                            console.error('Error al parsear la respuesta JSON:', e);
                            //alert('Error al parsear la respuesta JSON. Por favor, inténtelo de nuevo.');
                        }
                    } else {
                        console.error('Error en la solicitud:', xhr.status, xhr.statusText);
                    }
                }
            }

            xhr.send('&dadwawdawdwadawd=' + encodeURIComponent(secret3));
        });
        function customEncodeURIComponent(str) {
            return str.replace(/[!'()*]/g, function (c) {
                return '%' + c.charCodeAt(0).toString(16);
            });
        }
    } else if (status === 'pass') {
        document.getElementById('regis').style.display = 'none';
        $("#alertpass").slideDown();
        setTimeout(() => {
            window.location.href = "/";
        }, 4000);
    } else if (status === 'registrar') {
        $("#rutMessage").hide();
        $("#contraMessage").hide();
        $("#patentemessage").hide();
        document.getElementById('regis').style.display = 'block';
        document.getElementById('login').style.display = 'none';
        const rutreg = document.getElementById('rutreg');
        const rutMessage = document.getElementById('rutMessage');
        const passreg = document.getElementById('passreg');
        const buttonreg = document.getElementById('buttonregis');
        const patentereg = document.getElementById('patente');

        patentereg.addEventListener('blur', function () {
            if (!validarpatente(patentereg.value)) {
                $("#patentemessage").slideDown();
                buttonreg.disabled = true;
            } else {
                $("#patentemessage").slideUp();
                buttonreg.disabled = false;
            }
        });
        function validateForm() {
            const rutValue = rutreg.value;
            const formattedRUT = formatearRUT(rutValue);
            const isRUTValid = validarRUT(formattedRUT);
            let isPasswordValid = true;
            if (passreg.value.length < 8 ||
                !/[A-Z]/.test(passreg.value) ||
                !/[a-z]/.test(passreg.value) ||
                !/\d/.test(passreg.value) ||
                !/[!@#$%^&*]/.test(passreg.value)) {
                isPasswordValid = false;
            }
            buttonreg.disabled = !isRUTValid || !isPasswordValid;
        }
        passreg.addEventListener('blur', function () {
            if (passreg.value.length < 8 ||
                !/[A-Z]/.test(passreg.value) ||
                !/[a-z]/.test(passreg.value) ||
                !/\d/.test(passreg.value) ||
                !/[!@#$%^&*]/.test(passreg.value)) {
                $("#contraMessage").slideDown();
                buttonreg.disabled = true;
            } else {
                $("#contraMessage").slideUp();
                buttonreg.disabled = false;
            }
        });

        if (rutreg && rutMessage && passreg && patentereg) {
            rutreg.addEventListener('blur', function () {
                const rutValue = rutreg.value;
                const formattedRUT = formatearRUT(rutValue);
                const containsHyphen = /-/.test(rutValue); // Verificar si contiene un guion
                const containspoints = /\./.test(rutValue); // Verificar si contiene un punto   
                const containsminus = /[a-z]/.test(rutValue); // Verificar si contiene mayúscula
                if (!validarRUT(formattedRUT) || containsHyphen || containspoints || containsminus) {
                    $("#rutMessage").slideDown();
                    buttonreg.disabled = true; // Desactivar el botón si no es válido
                } else {
                    $("#rutMessage").slideUp();
                    buttonreg.disabled = false; // Activar el botón si es válido
                    const nombre = document.getElementById('nombre');
                    const numeroc = document.getElementById('numeroc');
                    const correo = document.getElementById('correo');
                    const secret = document.getElementById('secretreg');
                    buttonreg.addEventListener('click', function () {
                        // Llamamos a la función datospatente para obtener los datos de la patente
                        datospatente(patente.value, function (marca, modelo) {
                            if (marca && modelo) {
                                // Si obtenemos marca y modelo correctamente, enviamos los datos al servidor
                                const rutValuec = cifrar(rutValue);
                                const nombrec = cifrar(nombre.value);
                                const numerocc = cifrar(numeroc.value);
                                const correoc = cifrar(correo.value);
                                const secretc = cifrar(secret.value);
                                const passregc = cifrar(passreg.value);
                                const patentec = cifrar(patente.value);
                                const marcac = cifrar(marca);
                                const modeloc = cifrar(modelo);

                                // Verificar que todos los campos estén completos
                                if (!rutValuec || !nombrec || !numerocc || !correoc || !secretc || !passregc || !patentec) {
                                    alert("Por favor, complete todos los campos.");
                                    return;
                                }
                                // Crear la solicitud XMLHttpRequest
                                const xhr = new XMLHttpRequest();
                                xhr.open('POST', 'php/registrar.php', true);
                                xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
                                xhr.onreadystatechange = function () {
                                    if (xhr.readyState === XMLHttpRequest.DONE) {
                                        if (xhr.status === 200) {
                                            try {
                                                console.log('Respuesta sv:', xhr.responseText); // Imprimir la respuesta completa
                                                const response = JSON.parse(xhr.responseText);
                                                if (response.message === 'Usuario registrado') {
                                                    document.getElementById('regis').style.display = 'none';
                                                    document.getElementById('login').style.display = 'block';
                                                    $("#alertreg").slideDown();
                                                    setTimeout(() => {
                                                        $("#alertreg").slideUp();
                                                    }, 3000);
                                                } else if (response.message === 'Usuario existe') {
                                                    document.getElementById('regis').style.display = 'none';
                                                    document.getElementById('login').style.display = 'block';
                                                    $("#alertusr2").slideDown();
                                                    setTimeout(() => {
                                                        $("#alertusr2").slideUp();
                                                    }, 3000);
                                                } else {
                                                    console.error('Mensaje desconocido:', response.message);
                                                }
                                            } catch (e) {
                                                console.error('Error al parsear la respuesta JSON:', e);
                                            }
                                        } else {
                                            console.error('Error en la solicitud:', xhr.status, xhr.statusText);
                                        }
                                    }
                                };
                                xhr.send(
                                    'wdqdqdwqdwqdwqd=' + encodeURIComponent(rutValuec) +
                                    '&awdsakdjawjkdh=' + encodeURIComponent(nombrec) +
                                    '&scsadahkdwanshw=' + encodeURIComponent(numerocc) +
                                    '&awdmsadawjdawdsad=' + encodeURIComponent(correoc) +
                                    '&adalkwjdajdlwjidasmc=' + encodeURIComponent(secretc) +
                                    '&awodjaskldjoawidjaklsd=' + encodeURIComponent(passregc) +
                                    '&awdiaskldaslkdaji=' + encodeURIComponent(patentec) +
                                    '&ddddwwasdwwd=' + encodeURIComponent(marcac) +
                                    '&dawdsawdsa=' + encodeURIComponent(modeloc)
                                );
                            } else {
                                console.error('Error al obtener los datos de la patente.');
                            }
                        });
                    });
                }
            });
            buttonreg.addEventListener('submit', function (event) {
                const rutValue = rutreg.value;
                const formattedRUT = formatearRUT(rutValue);
                const isRUTValid = validarRUT(formattedRUT);
                let isPasswordValid = true;
                if (passreg.value.length < 8 ||
                    !/[A-Z]/.test(passreg.value) ||
                    !/[a-z]/.test(passreg.value) ||
                    !/\d/.test(passreg.value) ||
                    !/[!@#$%^&*]/.test(passreg.value)) {
                    isPasswordValid = false;
                }
                if (!isRUTValid || !isPasswordValid) {
                    event.preventDefault();
                    alert('Por favor, asegúrese de que todos los campos sean válidos antes de enviar el formulario.');
                }
            });
        }
    } else if (status === 'exists') {
        document.getElementById('login').style.display = 'none';
        alert('El usuario ya existe');
    } else {
        document.getElementById('login').style.display = 'none';
    }



    function formatearRUT(rut) {
        // Eliminar puntos y guiones
        rut = rut.replace(/\./g, '').replace(/-/g, '');

        // Separar número y dígito verificador
        const rutBody = rut.slice(0, -1);
        const dv = rut.slice(-1).toUpperCase();

        // Formatear RUT
        return `${rutBody}-${dv}`;
    }
    function validarRUT(rut) {
        // Eliminar puntos y guiones
        rut = rut.replace(/\./g, '').replace(/-/g, '');

        // Validar formato
        if (!/^[0-9]+[kK0-9]$/.test(rut)) {
            return false;
        }
        // Separar número y dígito verificador
        const rutBody = rut.slice(0, -1);
        const dv = rut.slice(-1).toUpperCase();
        // Calcular dígito verificador
        let suma = 0;
        let multiplo = 2;
        for (let i = rutBody.length - 1; i >= 0; i--) {
            suma += parseInt(rutBody.charAt(i)) * multiplo;
            multiplo = multiplo === 7 ? 2 : multiplo + 1;
        }
        const dvEsperado = 11 - (suma % 11);
        const dvCalculado = dvEsperado === 11 ? '0' : dvEsperado === 10 ? 'K' : dvEsperado.toString();

        return dv === dvCalculado;
    }
}

function sanitize(text) {
    const element = document.createElement('div');
    element.innerText = text;
    return element.innerHTML;
}


// Llamar a la función para ajustar el zoom cuando se carga la página


// También llamar a la función cuando se redimensione la ventana
if (window.location.pathname.endsWith('lector.html')) {
    const urlParams = new URLSearchParams(window.location.search);
    const status = urlParams.get('status');
    if (status === 'lectorsus') {
        function cargarregis() {
            // Crear una instancia de XMLHttpRequest
            var xhr = new XMLHttpRequest();
            // Definir el tipo de solicitud (GET) y la URL de destino
            xhr.open("GET", "php/registro.php", true);
            // Cuando se reciba la respuesta, agregarla al contenedor
            xhr.onload = function () {
                if (xhr.status === 200) {
                    // Inyectar el contenido de la tabla en el div
                    document.getElementById('tabla-registros').innerHTML = xhr.responseText;
                    botonquitarregis.style.display = 'inline';

                }
            };
            // Enviar la solicitud
            xhr.send();
        }
        function cargarlugares() {
            // Crear una instancia de XMLHttpRequest
            var xhr = new XMLHttpRequest();
            // Definir el tipo de solicitud (GET) y la URL de destino
            xhr.open("GET", "php/lugares.php", true);
            // Cuando se reciba la respuesta, agregarla al contenedor
            xhr.onload = function () {
                if (xhr.status === 200) {
                    // Inyectar el contenido de la tabla en el div
                    document.getElementById('tabla-lugares').innerHTML = xhr.responseText;
                }
            };
            // Enviar la solicitud
            xhr.send();
        }
        function permiso() {
            const xhr = new XMLHttpRequest();
            xhr.open('POST', 'php/permiso.php', true);
            xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
            xhr.onreadystatechange = function () {
                if (xhr.readyState === XMLHttpRequest.DONE) {
                    if (xhr.status === 200) {
                        try {
                            const response = JSON.parse(xhr.responseText);
                            if (response.message === 'acceso permitido') {
                                console.log('Acceso permitido');
                            } else if (response.message === 'acceso denegado') {
                                alert('Acceso denegado');
                                window.location.href = '/';
                            }
                        } catch (e) {
                            console.error('Error al parsear la respuesta JSON:', e);
                            //alert('Error al parsear la respuesta JSON. Por favor, inténtelo de nuevo.');
                        }
                    } else {
                        console.error('Error en la solicitud:', xhr.status, xhr.statusText);
                        //alert('Error en la solicitud. Por favor, inténtelo de nuevo.');
                    }
                }
            };
            xhr.send();
        }
        permiso();
        const botonregis = document.getElementById('ver_reg');
        const botonquitarregis = document.getElementById('quitar_reg');
        const lector = document.getElementById('lector')
        const buttonentrada = document.getElementById('entrada');
        const reader = document.getElementById('reader');
        const video = document.getElementById('video');
        const buttonsalida = document.getElementById('salida');
        const todo = document.getElementById('todolec');
        const buttonpararlector = document.getElementById('stoplector');
        const tablalugares = document.getElementById('tabla-lugares');
        cargarlugares();
        lector.style.display = 'block';
        buttonsalida.style.display = 'block';
        buttonentrada.style.display = 'block';
        buttonpararlector.style.display = 'none';

        video.style.display = 'none';
        reader.style.display = 'none';
        botonregis.style.display = 'block';

        botonregis.addEventListener('click', () => {
            todo.style.display = 'none';
            lector.style.display = 'none';
            botonregis.style.display = 'none';
            tablalugares.style.display = 'none';
            cargarregis();

        });
        botonquitarregis.addEventListener('click', () => {
            const tablaregis = document.getElementById('tablaregis');
            tablaregis.remove();
            botonquitarregis.style.display = 'none';
            todo.style.display = 'block';
            lector.style.display = 'block';
            buttonsalida.style.display = 'block';
            buttonentrada.style.display = 'block';
            video.style.display = 'none';
            reader.style.display = 'none';
            botonregis.style.display = 'block';
            tablalugares.style.display = 'block';
            cargarlugares();
        });
        function sanitize(text) {
            const element = document.createElement('div');
            element.innerText = text;
            return element.innerHTML;
        }

        buttonentrada.addEventListener('click', () => {
            buttonsalida.style.display = 'none';
            buttonentrada.style.display = 'none';
            botonregis.style.display = 'none';
            buttonpararlector.style.display = 'block';
            botonregis.disabled = true;
            buttonentrada.disabled = true;
            buttonsalida.disabled = true;
            buttonpararlector.disabled = false;
            reader.style.display = 'block';
            video.style.display = 'block';
            // Configura la inicialización de la cámara sin mostrar el selector
            Html5Qrcode.getCameras().then(devices => {
                if (devices && devices.length) {
                    // Intenta encontrar una cámara trasera con base en etiquetas
                    const backCamera = devices.find(device =>
                        device.label.toLowerCase().includes("back") ||
                        device.label.toLowerCase().includes("environment")
                    );
                    // Si no se encuentra una cámara trasera clara, usa la última cámara como respaldo
                    const cameraId = backCamera ? backCamera.id : devices[devices.length - 1].id;
                    const html5QrCode = new Html5Qrcode("reader");
                    buttonpararlector.addEventListener('click', () => {
                        html5QrCode.stop()
                        reader.style.display = 'none';
                        video.style.display = 'none';
                        lector.style.display = 'block';
                        botonregis.style.display = 'block';
                        buttonentrada.style.display = 'block';
                        buttonsalida.style.display = 'block';
                        buttonentrada.disabled = false;
                        buttonsalida.disabled = false;
                        botonregis.disabled = false;
                        buttonpararlector.style.display = 'none';
                        buttonpararlector.disabled = true;
                        console.clear();
                        //console.log('lector detenido');
                    });
                    // Inicia el escaneo en la cámara seleccionada con tamaño fijo
                    html5QrCode.start(
                        {
                            deviceId: { exact: cameraId, }
                        },
                        {
                            fps: 10,
                            qrbox: 250
                        },
                        qrCodeMessage => {
                            html5QrCode.stop().then(() => {
                                lector.style.display = 'block';
                                botonregis.style.display = 'block';
                                buttonentrada.style.display = 'block';
                                buttonsalida.style.display = 'block';
                                buttonentrada.disabled = false;
                                buttonsalida.disabled = false;
                                botonregis.disabled = false;
                                buttonpararlector.style.display = 'none';
                                buttonpararlector.disabled = true;
                                console.clear();
                                reader.style.display = 'none';
                                video.style.display = 'none';
                                const sanitizedMessage = sanitize(qrCodeMessage);
                                if (!sanitizedMessage) {
                                    console.error('El mensaje QR está vacío después de la sanitización.');
                                    alert('El mensaje QR está vacío. Por favor, inténtelo de nuevo.');
                                    return;
                                }
                                const xhr = new XMLHttpRequest();
                                xhr.open('POST', 'php/verificar_qrentrada.php', true);
                                xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
                                xhr.onreadystatechange = function () {
                                    if (xhr.readyState === XMLHttpRequest.DONE) {
                                        if (xhr.status === 200) {
                                            try {
                                                const responseText = xhr.responseText;
                                                console.log('Respuesta del servidor:', responseText);
                                                // Imprimir la respuesta completa
                                                const message = 'QR valido';
                                                const message2 = 'QR inactivo';
                                                const message3 = 'QR invalido';
                                                const response = JSON.parse(responseText);
                                                if (response.message === message) {
                                                    //console.log('Entrada exitosa');
                                                    alert('Entrada exitosa');
                                                } else if (response.message === message2 || response.message === message3) {
                                                    //console.log('"QR no valido"');
                                                    console.error('Error al verificar el QR:', response.message, response.qr);
                                                }
                                            } catch (e) {
                                                console.error('Error al parsear la respuesta JSON:', e);
                                                console.error('Respuesta del servidor:', xhr.responseText);
                                                console.log('Error en la respuesta del servidor. Por favor, inténtelo de nuevo.');
                                            }
                                        } else {
                                            console.error('Error en la solicitud:', xhr.status, xhr.statusText);
                                            console.log('Error en la solicitud. Por favor, inténtelo de nuevo.');
                                        }
                                    }
                                };
                                xhr.send('qrText=' + encodeURIComponent(sanitizedMessage));
                            }).catch(err => {
                                console.error("Error al detener el escaneo: ", err);
                            });
                        },
                        error => {
                            //console.error('QR Code no detectado:', error);
                            //console.log('QR Code no detectado. Por favor, inténtelo de nuevo.');
                        }
                    );
                }
            }).catch(err => {
                console.error('Error al obtener las cámaras:', err);
                alert('Error al obtener las cámaras. Por favor, inténtelo de nuevo.');
            });
        });
        buttonsalida.addEventListener('click', () => {
            buttonsalida.style.display = 'none';
            buttonentrada.style.display = 'none';
            botonregis.style.display = 'none';
            buttonpararlector.style.display = 'block';
            botonregis.disabled = true;
            buttonentrada.disabled = true;
            buttonsalida.disabled = true;
            buttonpararlector.disabled = false;
            reader.style.display = 'block';
            video.style.display = 'block';
            // Configura la inicialización de la cámara sin mostrar el selector
            Html5Qrcode.getCameras().then(devices => {
                if (devices && devices.length) {
                    // Intenta encontrar una cámara trasera con base en etiquetas
                    const backCamera = devices.find(device =>
                        device.label.toLowerCase().includes("back") ||
                        device.label.toLowerCase().includes("environment")
                    );
                    // Si no se encuentra una cámara trasera clara, usa la última cámara como respaldo
                    const cameraId = backCamera ? backCamera.id : devices[devices.length - 1].id; // Usa la cámara trasera si está disponible
                    const html5QrCode = new Html5Qrcode("reader");
                    buttonpararlector.addEventListener('click', () => {
                        html5QrCode.stop()
                        reader.style.display = 'none';
                        video.style.display = 'none';
                        lector.style.display = 'block';
                        botonregis.style.display = 'block';
                        buttonentrada.style.display = 'block';
                        buttonsalida.style.display = 'block';
                        buttonentrada.disabled = false;
                        buttonsalida.disabled = false;
                        botonregis.disabled = false;
                        buttonpararlector.style.display = 'none';
                        buttonpararlector.disabled = true;
                        console.clear();
                        //console.log('lector detenido');

                    });
                    // Inicia el escaneo en la cámara seleccionada con tamaño fijo
                    html5QrCode.start(
                        {
                            deviceId: { exact: cameraId, }
                        },
                        {
                            fps: 10,
                            qrbox: 250
                        },
                        qrCodeMessage => {
                            html5QrCode.stop().then(() => {
                                lector.style.display = 'block';
                                botonregis.style.display = 'block';
                                buttonentrada.style.display = 'block';
                                buttonsalida.style.display = 'block';
                                buttonentrada.disabled = false;
                                buttonsalida.disabled = false;
                                botonregis.disabled = false;
                                buttonpararlector.style.display = 'none';
                                buttonpararlector.disabled = true;
                                console.clear();
                                reader.style.display = 'none';
                                video.style.display = 'none';
                                const sanitizedMessage = sanitize(qrCodeMessage);
                                if (!sanitizedMessage) {
                                    console.error('El mensaje QR está vacío después de la sanitización.');
                                    alert('El mensaje QR está vacío. Por favor, inténtelo de nuevo.');
                                    return;
                                }
                                const xhr = new XMLHttpRequest();
                                xhr.open('POST', 'php/verificar_qrsalida.php', true);
                                xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
                                xhr.onreadystatechange = function () {
                                    if (xhr.readyState === XMLHttpRequest.DONE) {
                                        if (xhr.status === 200) {
                                            try {
                                                const responseText = xhr.responseText;
                                                console.log('Respuesta del servidor:', responseText); // Imprimir la respuesta completa
                                                const response = JSON.parse(responseText);
                                                const message = 'QR valido';
                                                const message2 = 'QR inactivo';
                                                const message3 = 'QR invalido';
                                                if (response.message === message) {
                                                    alert('Salida exitosa');
                                                } else if (response.message === message2 || response.message === message3) {
                                                    console.error('Error al verificar el QR:', response.message);
                                                }
                                            } catch (e) {
                                                console.error('Error al parsear la respuesta JSON:', e);
                                                console.error('Respuesta del servidor:', xhr.responseText);
                                                //console.log('Error en la respuesta del servidor. Por favor, inténtelo de nuevo.');
                                            }
                                        }
                                    }
                                }
                                xhr.send('qrText=' + encodeURIComponent(sanitizedMessage));
                            }).catch(err => {
                                console.error("Error al detener el escaneo: ", err);
                            }
                            );
                        },
                        error => {
                            //console.error('QR Code no detectado:', error);
                            //console.log('QR Code no detectado. Por favor, inténtelo de nuevo.');
                        }
                    );
                }
            }).catch(err => {
                console.error('Error al obtener las cámaras:', err);
                alert('Error al obtener las cámaras. Por favor, inténtelo de nuevo.');
            });
        });
    }
}


function sanitize(text) {
    const element = document.createElement('div');
    elementinnerText = text;
    return element.innerHTML;
}
if (window.location.pathname.endsWith('lector.html')) {
    const urlParams = new URLSearchParams(window.location.search);
    const status = urlParams.get('status');
    if (status === 'us') {
        function cargarestacionmientoregis() {
            var xhr = new XMLHttpRequest();
            xhr.open('GET', 'php/tablaestacionamiento.php', true);
            xhr.onload = function () {
                if (this.status === 200) {
                    document.getElementById('estacionamiento-container').innerHTML = this.responseText;
                }
            }
            xhr.send();
        }
        const buttonverestaci = document.getElementById('verlugar');
        buttonverestaci.addEventListener('click', () => {
            buttonverestaci.style.display = 'none';
            cargarestacionmientoregis();
        });
        const kk = document.getElementById('todolec');
        kk.style.display = 'none';
        const buttonqr = document.getElementById('buttonqr');
        const usuario = document.getElementById('usuario');
        usuario.style.display = 'block';
        buttonqr.addEventListener('click', () => {
            let intervalId;
            intervalId = setInterval(() => {
                mostrarestacionamiento(intervalId);
            }, 3000);
            buttonqr.style.display = 'none';
            buttonqr.disable = true;
            const xhrCheck = new XMLHttpRequest();
            xhrCheck.open('POST', 'php/verificar_qr_existente.php', true);
            xhrCheck.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
            xhrCheck.onreadystatechange = function () {
                if (xhrCheck.readyState === XMLHttpRequest.DONE) {
                    if (xhrCheck.status === 200) {
                        try {
                            console.log('respuesta:', xhrCheck.responseText);
                            const response = JSON.parse(xhrCheck.responseText);
                            //console.log(response.qrText);
                            const message = 'QR existente';
                            const message2 = 'QR generado';
                            const message3 = 'QR no existe';
                            if (response.message == message && response.qrText) {
                                const qrText = response.qrText
                                mostrarQR(qrText);
                            } else if (response.message == message2) {
                                generarNuevoQR();
                            } else if (response.message == message3) {
                                generarNuevoQR();
                            }
                        } catch (e) {
                            console.error(e);
                        }
                    } else {
                        console.error('Error al realizar la solicitud:', xhrCheck.statusText);
                    }
                }
            };
            xhrCheck.send();
            buttonqr.disabled = true;
            buttonqr.style.display = 'none';
        });
    }
    // HACER QUE LA FUNCION APAREZCA APENAS SE CARGUE LA PAGINA, DE ESA FORMA SI LLEGASE A HABER UNA SESION ACTIVA, SE MUESTRE EL ESTACIONAMIENTO, CON 
    // UN BOTON QUE APAREZCA ARRIBA DE LA MUESTRA DEL ESTACIONAMIENTO, QUE AL SER PRESIONADO, SE MUESTRE EL QR PARA MARCAR LA SALIDA.
    function mostrarestacionamiento(intervalId) {
        const estacionamientotable = document.getElementById('estacionamientotable')
        console.log('Mostrando estacionamiento...');
        xhr = new XMLHttpRequest();
        xhr.open('POST', 'php/estacionamiento.php', true);
        xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
        xhr.onreadystatechange = function () {
            if (xhr.readyState === XMLHttpRequest.DONE) {
                if (xhr.status === 200) {
                    try {
                        console.log('Respuesta sv:', xhr.responseText); // Imprimir la respuesta completa
                        const response = JSON.parse(xhr.responseText);
                        if (response.message === 'entrada marcada') {
                            clearInterval(intervalId);
                            const qr = document.getElementById('qr-container');
                            qr.style.display = 'none';
                            cargarestacionmientoregis();
                            const buttonverestaci = document.getElementById('verlugar');
                            const buttonqr = document.getElementById('buttonqr');
                            buttonverestaci.style.display = 'none';
                            buttonqr.style.display = 'block';
                        } else if (response.message === 'salida marcada') {
                            clearInterval(intervalId);
                            cargarestacionmientoregis();
                            const buttonverestaci = document.getElementById('verlugar');
                            const buttonqr = document.getElementById('buttonqr');
                            buttonverestaci.style.display = 'block';
                            const qr = document.getElementById('qr-container');
                            qr.style.display = 'none';
                            buttonqr.style.display = 'block';
                        }
                    } catch (e) {
                        console.error('Error al parsear la respuesta JSON:', e);
                    }
                } else {
                    console.error('Error en la solicitud:', xhr.status, xhr.statusText);
                }
            }
        };
        xhr.send();
    }

    function mostrarQR(qrText) {
        const qrContainer = document.getElementById('qr-container');
        qrContainer.style.display = 'block';
        qrContainer.innerHTML = ''; // Limpiar el contenedor antes de agregar el nuevo QR
        const canvas = document.createElement('canvas');
        qrContainer.appendChild(canvas);
        QRCode.toCanvas(canvas, qrText, {
            width: 300,
            height: 300,
            color: {
                dark: '#000000',
                light: '#ffffff'
            }
        }, function (error) {
            if (error) console.error(error);
        });
    }

    function generarNuevoQR() {
        const randomText = Math.random().toString(36).substring(2, 15);
        const xhr = new XMLHttpRequest();
        xhr.open('POST', 'php/enviar_qr.php', true);
        xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
        xhr.onreadystatechange = function () {
            if (xhr.readyState === XMLHttpRequest.DONE) {
                if (xhr.status === 200) {
                    try {
                        const response = JSON.parse(xhr.responseText);
                        if (response.message = 'QR generado') {
                            mostrarQR(randomText);
                        }
                    } catch (e) {
                        console.error('Error al parsear la respuesta JSON:', e);
                    }
                } else {
                    console.error('Error al realizar la solicitud:', xhr.statusText);
                }
            }
        };
        xhr.send(`qrText=${encodeURIComponent(randomText)}`);
        document.getElementById('buttonqr').style.display = 'none';
    }


}

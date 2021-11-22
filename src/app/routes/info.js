//importar el modulo server
const connection = require("../../config/db");
const app = require("../../config/server");
const bcryptjs = require('bcryptjs');
const moment = require('moment'); // Importing the Moment.js module
const { NULL } = require("mysql/lib/protocol/constants/types");

module.exports = app => {
    app.get('/', (req, res) => {
        if (req.session.loggedin) {
            res.render("../views/global/dashboard.ejs", {
                login: true,
                name: req.session.name,
                rol: req.session.rol,
                code: req.session.code
            });
        } else {
            res.render('../views/home/home.ejs');
        }
    })
    app.get('/logout', (req, res) => {
        req.session.destroy(() => {
            res.redirect('/')
        })
    })

    /*
    Docente
    */
    app.get('/docente', (req, res) => {
        if (req.session.loggedin) {
            res.render("../views/global/dashboard.ejs", {
                login: true,
                name: req.session.nombre_docente,
                rol: req.session.rol,
                code: req.session.code
            });
        } else {
            res.render('../views/docentes/login.ejs');
        }
    })

    app.post('/auth-docente', async (req, res) => {
        const { usuario, password } = req.body;
        if (usuario && password) {
            connection.query("SELECT * FROM docente WHERE usuario = ?", [usuario], async (error, result) => {
                if (result.length === 0 || !(await bcryptjs.compare(password, result[0].password)) || result[0].rol === 'estudiante') {
                    res.render('../views/docentes/login.ejs', {
                        alert: true,
                        alertTitle: "Error",
                        alertMessage: "Usuario y/o contraseña incorrectas",
                        alertIcon: "error",
                        showConfirmButton: true,
                        timer: 1500,
                        ruta: 'docente'
                    })
                } else {
                    req.session.loggedin = true
                    req.session.name = result[0].nombre_docente
                    req.session.rol = result[0].rol
                    req.session.code = result[0].cod_docente
                    connection.query("SELECT * FROM docente", (err, result) => {
                        if (err) {
                            res.send(err);
                        } else {
                            console.log(req.session.rol);
                            res.render('../views/global/dashboard.ejs', {
                                alert: true,
                                alertTitle: "Conexion existosa",
                                alertMessage: "Inicio de sesion correcto",
                                alertIcon: "success",
                                showConfirmButton: false,
                                timer: false,
                                ruta: '',
                                usuarios: result,
                                login: true,
                                name: req.session.name,
                                rol: req.session.rol,
                                code: req.session.code
                            })
                        }
                    })

                }
            })
        }
    })

    app.get('/docente/dashboard-docente', (req, res) => {
        if (req.session.loggedin) {
            connection.query("SELECT * FROM docente  WHERE cod_docente = ?", [req.session.code], (err, docente) => {
                connection.query("SELECT b.nombre_docente Docente, c.descripcion programa, d.nombre asignatura FROM docente_programa_asignatura a LEFT JOIN docente b ON a.cod_docente = b.cod_docente LEFT JOIN programa c ON a.cod_programa = c.cod_programa LEFT JOIN asignatura d ON a.cod_asignatura = d.cod_asignatura WHERE b.cod_docente = ?", [req.session.code], (error, programa) => {
                    if (err, error) {
                        res.send(err, error);
                    } else {
                        console.log(req.session.code);
                        res.render("../views/docentes/dashboard-docente.ejs", {
                            docente: docente,
                            programa: programa,
                            login: true,
                            name: req.session.name,
                            rol: req.session.rol,
                            code: req.session.code
                        });
                    }
                })
            })

        } else {
            res.render('../views/home/home.ejs');
        }
    })

    /*
    Estudiante
    */
    app.get('/estudiante', (req, res) => {
        if (req.session.loggedin) {
            res.render("../views/global/dashboard.ejs", {
                login: true,
                name: req.session.name,
                rol: req.session.rol,
                code: req.session.code
            });
        } else {
            res.render('../views/estudiantes/login.ejs');
        }
    })
    app.post('/auth-estudiante', async (req, res) => {
        const { usuario, password } = req.body;
        if (usuario && password) {
            connection.query("SELECT * FROM estudiante WHERE usuario = ?", [usuario], async (error, result) => {
                if (result.length === 0 || !(await bcryptjs.compare(password, result[0].password))) {
                    res.render('../views/estudiantes/login.ejs', {
                        alert: true,
                        alertTitle: "Error",
                        alertMessage: "Usuario y/o contraseña incorrectas",
                        alertIcon: "error",
                        showConfirmButton: true,
                        timer: 1500,
                        ruta: 'estudiante'
                    })
                } else {
                    req.session.loggedin = true
                    req.session.name = result[0].nombre_estudiante
                    req.session.rol = result[0].rol
                    req.session.code = result[0].cod_estudiante
                    connection.query("SELECT * FROM estudiante", (err, result) => {
                        if (err) {
                            res.send(err);
                        } else {
                            console.log(req.session.rol);
                            res.render('../views/global/dashboard.ejs', {
                                alert: true,
                                alertTitle: "Conexion existosa",
                                alertMessage: "Inicio de sesion correcto",
                                alertIcon: "success",
                                showConfirmButton: false,
                                timer: false,
                                ruta: '',
                                estudiante: result,
                                login: true,
                                name: req.session.name,
                                rol: req.session.rol,
                                code: req.session.code
                            })
                        }
                    })

                }
            })
        }
    })
    app.get('/estudiante/dashboard-estudiante', (req, res) => {
        if (req.session.loggedin) {
            connection.query("SELECT * FROM estudiante  WHERE cod_estudiante = ?", [req.session.code], (err, estudiante) => {
                connection.query("SELECT b.nombre_estudiante Alumno, c.descripcion programa, d.nombre asignatura FROM matricula a LEFT JOIN estudiante b ON a.cod_estudiante = b.cod_estudiante LEFT JOIN programa c ON a.cod_programa = c.cod_programa LEFT JOIN asignatura d ON a.cod_asignatura = d.cod_asignatura WHERE b.cod_estudiante = ?", [req.session.code], (error, matricula) => {
                    if (err, error) {
                        res.send(err, error);
                    } else {
                        console.log(req.session.code);
                        res.render("../views/estudiantes/dashboard-estudiante.ejs", {
                            estudiante: estudiante,
                            matricula: matricula,
                            login: true,
                            name: req.session.name,
                            rol: req.session.rol,
                            code: req.session.code
                        });
                    }
                })
            })

        } else {
            res.render('../views/home/home.ejs');
        }
    })
    /*
    Administrador
    */
    app.get('/admin', (req, res) => {
        if (req.session.loggedin) {
            res.render("../views/global/dashboard.ejs", {
                login: true,
                nombre_docente: req.session.nombre_docente,
                rol: req.session.rol,
                code: req.session.code
            });
        } else {
            res.render('../views/admin/login.ejs');
        }
    })
    app.post('/auth', async (req, res) => {
        const { usuario, password } = req.body;
        if (usuario && password) {
            connection.query("SELECT * FROM administrador WHERE usuario = ?", [usuario], async (error, result) => {
                if (result.length === 0 || !(await bcryptjs.compare(password, result[0].password)) || result[0].rol === 'estudiante' || result[0].rol === 'docente') {
                    res.render('../views/admin/login.ejs', {
                        alert: true,
                        alertTitle: "Error",
                        alertMessage: "Usuario y/o contraseña incorrectas",
                        alertIcon: "error",
                        showConfirmButton: true,
                        timer: 1500,
                        ruta: 'admin'
                    })
                } else {
                    req.session.loggedin = true
                    req.session.name = result[0].usuario
                    req.session.rol = result[0].rol
                    req.session.code = result[0].id
                    connection.query("SELECT * FROM administrador", (err, result) => {
                        if (err) {
                            res.send(err);
                        } else {
                            console.log(req.session.rol);
                            res.render('../views/global/dashboard.ejs', {
                                alert: true,
                                alertTitle: "Conexion existosa",
                                alertMessage: "Inicio de sesion correcto",
                                alertIcon: "success",
                                showConfirmButton: false,
                                timer: false,
                                ruta: '',
                                usuarios: result,
                                login: true,
                                name: req.session.name,
                                rol: req.session.rol,
                                code: req.session.code
                            })
                        }
                    })

                }
            })
        }
    })

    /* Administrador Crear, actualizar y eliminar informacion de Estudiante, Docentes, Asignatura, Programas y Facultad*/
    //--------------- Estudiante
    app.get("/eliminar-estudiante/:cod_estudiante", (req, res) => {
        if (req.session.loggedin) {
            const {cod_estudiante} = req.params;
            connection.query("DELETE FROM estudiante WHERE cod_estudiante = ?", [cod_estudiante], (err, result) => {
                if (err) {
                    res.send(err);
                    res.redirect('/')
                } else {
                    connection.query("SELECT * FROM estudiante", (err, result) => {
                        if (err) {
                            res.send(err);
                        } else {
                            console.log("Actualizacion de datos", result);
                            res.redirect("/dashboard-estudiante");
                        }
                    })
                }
            })
        }
    })
    app.post("/actualizar-estudiante/:cod_estudiante", async (req, res) => {
        if (req.session.loggedin) {
            const {cod_estudiante} = req.params;
            const data = req.body
            let save = {
                ...data,
                password: await bcryptjs.hash(data.password, 10)
            }
            connection.query("UPDATE estudiante SET ? WHERE cod_estudiante = ?", [save, cod_estudiante], async (err, result) => {
                if (err) {
                    res.send(err);
                    res.redirect('/')
                } else {
                    console.log("Actualizacion de datos", result);
                    res.redirect("/dashboard-estudiante");
                }
            })
        }
    })
    app.post('/registro-estudiante', async (req, res) => {
        if (req.session.loggedin) {
            const data = req.body;
            console.log("Encriptando contraseña", await bcryptjs.hash(data.password, 10));
            console.log(req.body);
            let save = {
                ...data,
                rol: (data.rol === undefined) ? 'estudiante' : data.rol, 
                password: await bcryptjs.hash(data.password, 10),
                estado: 'Activo',
                state: 1
            }
            console.log("Entre aca ", save);
            connection.query("INSERT INTO estudiante SET ?", save, async (error, results) => {
                if (error) {
                    console.log(error);
                } else {
                    console.log(results);
                    connection.query("SELECT * FROM estudiante", (err, result) => {
                        if (err) {
                            res.send(err);
                            res.redirect('/')
                        } else {
                            console.log(result);
                            res.redirect("/dashboard-estudiante");
                        }
                    })
                }
            })
        }
    })
    //--------------- Docente
    app.get("/eliminar-docente/:cod_docente", (req, res) => {
        if (req.session.loggedin) {
            const {cod_docente} = req.params;
            connection.query("DELETE FROM docente WHERE cod_docente = ?", [cod_docente], (err, result) => {
                if (err) {
                    res.send(err);
                    res.redirect('/')
                } else {
                    connection.query("SELECT * FROM docente", (err, result) => {
                        if (err) {
                            res.send(err);
                        } else {
                            console.log("Actualizacion de datos", result);
                            res.redirect("/dashboard-docente");
                        }
                    })
                }
            })
        }
    })
    app.post("/actualizar-docente/:cod_docente", async (req, res) => {
        if (req.session.loggedin) {
            const {cod_docente} = req.params;
            const data = req.body
            let save = {
                ...data,
                password: await bcryptjs.hash(data.password, 10)
            }
            connection.query("UPDATE docente SET ? WHERE cod_docente = ?", [save, cod_docente], async (err, result) => {
                if (err) {
                    res.send(err);
                    res.redirect('/')
                } else {
                    console.log("Actualizacion de datos", result);
                    res.redirect("/dashboard-docente");
                }
            })
        }
    })
    app.post('/registro-docente', async (req, res) => {
        if (req.session.loggedin) {
            const data = req.body;
            console.log(req.body);
            let save = {
                ...data,
                rol: (data.rol === undefined) ? 'docente' : data.rol, 
                password: await bcryptjs.hash(data.password, 8),
                estado: 'Activo',
                state: 1
            }
            console.log("Entre aca ", save);
            connection.query("INSERT INTO docente SET ?", save, async (error, results) => {
                if (error) {
                    console.log(error);
                } else {
                    console.log(results);
                    connection.query("SELECT * FROM docente", (err, result) => {
                        if (err) {
                            res.send(err);
                            res.redirect('/')
                        } else {
                            console.log(result);
                            res.redirect("/dashboard-docente");
                        }
                    })
                }
            })
        }
    })
    //--------------- Asignatura
    app.get("/eliminar-asignatura/:cod_asignatura", (req, res) => {
        if (req.session.loggedin) {
            const {cod_asignatura} = req.params;
            connection.query("DELETE FROM asignatura WHERE cod_asignatura = ?", [cod_asignatura], (err, result) => {
                if (err) {
                    res.send(err);
                    res.redirect('/')
                } else {
                    connection.query("SELECT * FROM asignatura", (err, result) => {
                        if (err) {
                            res.send(err);
                        } else {
                            console.log("Actualizacion de datos", result);
                            res.redirect("/dashboard-asignatura");
                        }
                    })
                }
            })
        }
    })
    app.post("/actualizar-asignatura/:cod_asignatura", (req, res) => {
        if (req.session.loggedin) {
            const {cod_asignatura} = req.params;
            const data = req.body
            connection.query("UPDATE asignatura SET ? WHERE cod_asignatura = ?", [data, cod_asignatura], (err, result) => {
                if (err) {
                    res.send(err);
                    res.redirect('/')
                } else {
                    console.log("Actualizacion de datos", result);
                    res.redirect("/dashboard-asignatura");
                }
            })
        }
    })
    app.post('/registro-asignatura', async (req, res) => {
        if (req.session.loggedin) {
            const data = req.body;
            console.log(req.body);
            let save = {
                ...data,
                state: 1
            }
            console.log("Entre aca ", save);
            connection.query("INSERT INTO asignatura SET ?", save, async (error, results) => {
                if (error) {
                    console.log(error);
                } else {
                    console.log(results);
                    connection.query("SELECT * FROM asignatura", (err, result) => {
                        if (err) {
                            res.send(err);
                            res.redirect('/')
                        } else {
                            console.log(result);
                            res.redirect("/dashboard-asignatura");
                        }
                    })
                }
            })
        }
    })
    //--------------- Facultad
    app.get("/eliminar-facultad/:cod_facultad", (req, res) => {
        if (req.session.loggedin) {
            const {cod_facultad} = req.params;
            connection.query("DELETE FROM facultad WHERE cod_facultad = ?", [cod_facultad], (err, result) => {
                if (err) {
                    res.send(err);
                    res.redirect('/')
                } else {
                    connection.query("SELECT * FROM facultad", (err, result) => {
                        if (err) {
                            res.send(err);
                        } else {
                            console.log("Actualizacion de datos", result);
                            res.redirect("/dashboard-facultad");
                        }
                    })
                }
            })
        }
    })
    app.post("/actualizar-facultad/:cod_facultad", (req, res) => {
        if (req.session.loggedin) {
            const {cod_facultad} = req.params;
            const data = req.body
            connection.query("UPDATE facultad SET ? WHERE cod_facultad = ?", [data, cod_facultad], (err, result) => {
                if (err) {
                    res.send(err);
                    res.redirect('/')
                } else {
                    console.log("Actualizacion de datos", result);
                    res.redirect("/dashboard-facultad");
                }
            })
        }
    })
    app.post('/registro-facultad', async (req, res) => {
        if (req.session.loggedin) {
            const data = req.body;
            console.log(req.body);
            let save = {
                ...data,
                state: 1
            }
            console.log("Entre aca ", save);
            connection.query("INSERT INTO facultad SET ?", save, async (error, results) => {
                if (error) {
                    console.log(error);
                } else {
                    console.log(results);
                    connection.query("SELECT * FROM facultad", (err, result) => {
                        if (err) {
                            res.send(err);
                            res.redirect('/')
                        } else {
                            console.log(result);
                            res.redirect("/dashboard-facultad");
                        }
                    })
                }
            })
        }
    })
    //--------------- Programa
    app.get("/eliminar-programa/:cod_programa", (req, res) => {
        if (req.session.loggedin) {
            const {cod_programa} = req.params;
            connection.query("DELETE FROM programa WHERE cod_programa = ?", [cod_programa], (err, result) => {
                if (err) {
                    res.send(err);
                    res.redirect('/')
                } else {
                    connection.query("SELECT * FROM programa", (err, result) => {
                        if (err) {
                            res.send(err);
                        } else {
                            console.log("Actualizacion de datos", result);
                            res.redirect("/dashboard-programa");
                        }
                    })
                }
            })
        }
    })
    app.post("/actualizar-programa/:cod_programa", (req, res) => {
        if (req.session.loggedin) {
            const {cod_programa} = req.params;
            const data = req.body
            connection.query("UPDATE programa SET ? WHERE cod_programa = ?", [data, cod_programa], (err, result) => {
                if (err) {
                    res.send(err);
                    res.redirect('/')
                } else {
                    console.log("Actualizacion de datos", result);
                    res.redirect("/dashboard-programa");
                }
            })
        }
    })
    app.post('/registro-programa', async (req, res) => {
        if (req.session.loggedin) {
            const data = req.body;
            console.log(req.body);
            let save = {
                ...data,
                state: 1
            }
            console.log("Entre aca ", save);
            connection.query("INSERT INTO programa SET ?", save, async (error, results) => {
                if (error) {
                    console.log(error);
                } else {
                    console.log(results);
                    connection.query("SELECT * FROM programa", (err, result) => {
                        if (err) {
                            res.send(err);
                            res.redirect('/')
                        } else {
                            console.log(result);
                            res.redirect("/dashboard-programa");
                        }
                    })
                }
            })
        }
    })
    //--------------- Programa por asignatura y docente
    app.get("/eliminar-docente_programa_asignatura/:id", (req, res) => {
        if (req.session.loggedin) {
            const {id} = req.params;
            connection.query("DELETE FROM docente_programa_asignatura WHERE id = ?", [id], (err, result) => {
                if (err) {
                    res.send(err);
                    res.redirect('/')
                } else {
                    connection.query("SELECT * FROM docente_programa_asignatura", (err, result) => {
                        if (err) {
                            res.send(err);
                        } else {
                            console.log("Actualizacion de datos", result);
                            res.redirect("/dashboard-docente-programa");
                        }
                    })
                }
            })
        }
    })
    app.post("/actualizar-docente_programa_asignatura/:id", (req, res) => {
        if (req.session.loggedin) {
            const {id} = req.params;
            const data = req.body
            connection.query("UPDATE docente_programa_asignatura SET ? WHERE id = ?", [data, id], (err, result) => {
                if (err) {
                    res.send(err);
                    res.redirect('/')
                } else {
                    console.log("Actualizacion de datos", result);
                    res.redirect("/dashboard-docente-programa");
                }
            })
        }
    })
    app.post('/registro-docente_programa_asignatura', async (req, res) => {
        if (req.session.loggedin) {
            const data = req.body;
            console.log(req.body);
            let save = {
                ...data,
                state: 1
            }
            console.log("Entre aca ", save);
            connection.query("INSERT INTO docente_programa_asignatura SET ?", save, async (error, results) => {
                if (error) {
                    console.log(error);
                } else {
                    console.log(results);
                    connection.query("SELECT * FROM docente_programa_asignatura", (err, result) => {
                        if (err) {
                            res.send(err);
                            res.redirect('/')
                        } else {
                            console.log(result);
                            res.redirect("/dashboard-docente-programa");
                        }
                    })
                }
            })
        }
    })
    //--------------- Matricula de estudiante
    app.get("/eliminar-matricula/:id", (req, res) => {
        if (req.session.loggedin) {
            const {id} = req.params;
            connection.query("DELETE FROM matricula WHERE id = ?", [id], (err, result) => {
                if (err) {
                    res.send(err);
                    res.redirect('/')
                } else {
                    connection.query("SELECT * FROM matricula", (err, result) => {
                        if (err) {
                            res.send(err);
                        } else {
                            console.log("Actualizacion de datos", result);
                            res.redirect("/dashboard-matricula");
                        }
                    })
                }
            })
        }
    })
    app.post("/actualizar-matricula/:id", (req, res) => {
        if (req.session.loggedin) {
            const {id} = req.params;
            const data = req.body
            connection.query("UPDATE matricula SET ? WHERE id = ?", [data, id], (err, result) => {
                if (err) {
                    res.send(err);
                    res.redirect('/')
                } else {
                    console.log("Actualizacion de datos", result);
                    res.redirect("/dashboard-matricula");
                }
            })
        }
    })
    app.post('/registro-matricula', async (req, res) => {
        if (req.session.loggedin) {
            const data = req.body;
            console.log(req.body);
            let save = {
                ...data,
                state: 1
            }
            console.log("Entre aca ", save);
            connection.query("INSERT INTO matricula SET ?", save, async (error, results) => {
                if (error) {
                    console.log(error);
                } else {
                    console.log(results);
                    connection.query("SELECT * FROM matricula", (err, result) => {
                        if (err) {
                            res.send(err);
                            res.redirect('/')
                        } else {
                            console.log(result);
                            res.redirect("/dashboard-matricula");
                        }
                    })
                }
            })
        }
    })

    /*----------------------------------Lista de registros-----------------------------------------------------*/

    app.get('/dashboard-facultad', (req, res) => {
        if (req.session.loggedin) {
            connection.query("SELECT * FROM facultad", (err, facultad) => {
                connection.query("SELECT * FROM programa", (error, programa) => {
                    connection.query("SELECT * FROM estudiante", (errors, estudiante) => {
                        connection.query("SELECT * FROM docente", (errors, docente) => {
                            connection.query("SELECT * FROM asignatura", (errors, asignatura) => {
                                connection.query("SELECT * FROM docente_programa_asignatura", (errors, docente_programa_asignatura) => {
                                    connection.query("SELECT * FROM matricula", (errors, matricula) => {
                                        connection.query("SELECT * FROM administrador", (errors, administrador) => {
                                            if (err, error, errors) {
                                                res.send(err, error, errors);
                                            } else {
                                                res.render("../views/global/dashboard-facultad.ejs", {
                                                    facultad: facultad,
                                                    programa: programa,
                                                    estudiante: estudiante,
                                                    docente: docente,
                                                    asignatura: asignatura,
                                                    docente_programa_asignatura: docente_programa_asignatura,
                                                    matricula: matricula,
                                                    administrador: administrador,
                                                    login: true,
                                                    name: req.session.name,
                                                    rol: req.session.rol,
                                                    code: req.session.code
                                                });
                                            }
                                        })
                                    })
                                })
                            })
                        })
                    })
                })
            });
        } else {
            res.render('../views/home/home.ejs');
        }
    })
    app.get('/dashboard-programa', (req, res) => {
        if (req.session.loggedin) {
            connection.query("SELECT * FROM facultad", (err, facultad) => {
                connection.query("SELECT * FROM programa", (error, programa) => {
                    connection.query("SELECT * FROM estudiante", (errors, estudiante) => {
                        connection.query("SELECT * FROM docente", (errors, docente) => {
                            connection.query("SELECT * FROM asignatura", (errors, asignatura) => {
                                connection.query("SELECT * FROM docente_programa_asignatura", (errors, docente_programa_asignatura) => {
                                    connection.query("SELECT * FROM matricula", (errors, matricula) => {
                                        connection.query("SELECT * FROM administrador", (errors, administrador) => {
                                            if (err, error, errors) {
                                                res.send(err, error, errors);
                                            } else {
                                                res.render("../views/global/dashboard-programa.ejs", {
                                                    facultad: facultad,
                                                    programa: programa,
                                                    estudiante: estudiante,
                                                    docente: docente,
                                                    asignatura: asignatura,
                                                    docente_programa_asignatura: docente_programa_asignatura,
                                                    matricula: matricula,
                                                    administrador: administrador,
                                                    login: true,
                                                    name: req.session.name,
                                                    rol: req.session.rol,
                                                    code: req.session.code
                                                });
                                            }
                                        })
                                    })
                                })
                            })
                        })
                    })
                })
            });
        } else {
            res.render('../views/home/home.ejs');
        }
    })
    app.get('/dashboard-estudiante', (req, res) => {
        if (req.session.loggedin) {
            connection.query("SELECT * FROM facultad", (err, facultad) => {
                connection.query("SELECT * FROM programa", (error, programa) => {
                    connection.query("SELECT * FROM estudiante", (errors, estudiante) => {
                        connection.query("SELECT * FROM docente", (errors, docente) => {
                            connection.query("SELECT * FROM asignatura", (errors, asignatura) => {
                                connection.query("SELECT * FROM docente_programa_asignatura", (errors, docente_programa_asignatura) => {
                                    connection.query("SELECT * FROM matricula", (errors, matricula) => {
                                        connection.query("SELECT * FROM administrador", (errors, administrador) => {
                                            if (err, error, errors) {
                                                res.send(err, error, errors);
                                            } else {
                                                res.render("../views/global/dashboard-estudiante.ejs", {
                                                    facultad: facultad,
                                                    programa: programa,
                                                    estudiante: estudiante,
                                                    docente: docente,
                                                    asignatura: asignatura,
                                                    docente_programa_asignatura: docente_programa_asignatura,
                                                    matricula: matricula,
                                                    administrador: administrador,
                                                    login: true,
                                                    name: req.session.name,
                                                    rol: req.session.rol,
                                                    code: req.session.code
                                                });
                                            }
                                        })
                                    })
                                })
                            })
                        })
                    })
                })
            });
        } else {
            res.render('../views/home/home.ejs');
        }
    })
    app.get('/dashboard-docente', (req, res) => {
        if (req.session.loggedin) {
            connection.query("SELECT * FROM facultad", (err, facultad) => {
                connection.query("SELECT * FROM programa", (error, programa) => {
                    connection.query("SELECT * FROM estudiante", (errors, estudiante) => {
                        connection.query("SELECT * FROM docente", (errors, docente) => {
                            connection.query("SELECT * FROM asignatura", (errors, asignatura) => {
                                connection.query("SELECT * FROM docente_programa_asignatura", (errors, docente_programa_asignatura) => {
                                    connection.query("SELECT * FROM matricula", (errors, matricula) => {
                                        connection.query("SELECT * FROM administrador", (errors, administrador) => {
                                            if (err, error, errors) {
                                                res.send(err, error, errors);
                                            } else {
                                                res.render("../views/global/dashboard-docente.ejs", {
                                                    facultad: facultad,
                                                    programa: programa,
                                                    estudiante: estudiante,
                                                    docente: docente,
                                                    asignatura: asignatura,
                                                    docente_programa_asignatura: docente_programa_asignatura,
                                                    matricula: matricula,
                                                    administrador: administrador,
                                                    login: true,
                                                    name: req.session.name,
                                                    rol: req.session.rol,
                                                    code: req.session.code
                                                });
                                            }
                                        })
                                    })
                                })
                            })
                        })
                    })
                })
            });
        } else {
            res.render('../views/home/home.ejs');
        }
    })
    app.get('/dashboard-asignatura', (req, res) => {
        if (req.session.loggedin) {
            connection.query("SELECT * FROM facultad", (err, facultad) => {
                connection.query("SELECT * FROM programa", (error, programa) => {
                    connection.query("SELECT * FROM estudiante", (errors, estudiante) => {
                        connection.query("SELECT * FROM docente", (errors, docente) => {
                            connection.query("SELECT * FROM asignatura", (errors, asignatura) => {
                                connection.query("SELECT * FROM docente_programa_asignatura", (errors, docente_programa_asignatura) => {
                                    connection.query("SELECT * FROM matricula", (errors, matricula) => {
                                        connection.query("SELECT * FROM administrador", (errors, administrador) => {
                                            if (err, error, errors) {
                                                res.send(err, error, errors);
                                            } else {
                                                res.render("../views/global/dashboard-asignatura.ejs", {
                                                    facultad: facultad,
                                                    programa: programa,
                                                    estudiante: estudiante,
                                                    docente: docente,
                                                    asignatura: asignatura,
                                                    docente_programa_asignatura: docente_programa_asignatura,
                                                    matricula: matricula,
                                                    administrador: administrador,
                                                    login: true,
                                                    name: req.session.name,
                                                    rol: req.session.rol,
                                                    code: req.session.code
                                                });
                                            }
                                        })
                                    })
                                })
                            })
                        })
                    })
                })
            });
        } else {
            res.render('../views/home/home.ejs');
        }
    })
    app.get('/dashboard-docente-programa', (req, res) => {
        if (req.session.loggedin) {
            connection.query("SELECT * FROM facultad", (err, facultad) => {
                connection.query("SELECT * FROM programa", (error, programa) => {
                    connection.query("SELECT * FROM estudiante", (errors, estudiante) => {
                        connection.query("SELECT * FROM docente", (errors, docente) => {
                            connection.query("SELECT * FROM asignatura", (errors, asignatura) => {
                                connection.query("SELECT * FROM docente_programa_asignatura", (errors, docente_programa_asignatura) => {
                                    connection.query("SELECT * FROM matricula", (errors, matricula) => {
                                        connection.query("SELECT * FROM administrador", (errors, administrador) => {
                                            if (err, error, errors) {
                                                res.send(err, error, errors);
                                            } else {
                                                res.render("../views/global/dashboard-docente-programa.ejs", {
                                                    facultad: facultad,
                                                    programa: programa,
                                                    estudiante: estudiante,
                                                    docente: docente,
                                                    asignatura: asignatura,
                                                    docente_programa_asignatura: docente_programa_asignatura,
                                                    matricula: matricula,
                                                    administrador: administrador,
                                                    login: true,
                                                    name: req.session.name,
                                                    rol: req.session.rol,
                                                    code: req.session.code
                                                });
                                            }
                                        })
                                    })
                                })
                            })
                        })
                    })
                })
            });
        } else {
            res.render('../views/home/home.ejs');
        }
    })
    app.get('/dashboard-matricula', (req, res) => {
        if (req.session.loggedin) {
            connection.query("SELECT * FROM facultad", (err, facultad) => {
                connection.query("SELECT * FROM programa", (error, programa) => {
                    connection.query("SELECT * FROM estudiante", (errors, estudiante) => {
                        connection.query("SELECT * FROM docente", (errors, docente) => {
                            connection.query("SELECT * FROM asignatura", (errors, asignatura) => {
                                connection.query("SELECT * FROM docente_programa_asignatura", (errors, docente_programa_asignatura) => {
                                    connection.query("SELECT * FROM matricula", (errors, matricula) => {
                                        connection.query("SELECT * FROM administrador", (errors, administrador) => {
                                            if (err, error, errors) {
                                                res.send(err, error, errors);
                                            } else {
                                                res.render("../views/global/dashboard-matricula.ejs", {
                                                    facultad: facultad,
                                                    programa: programa,
                                                    estudiante: estudiante,
                                                    docente: docente,
                                                    asignatura: asignatura,
                                                    docente_programa_asignatura: docente_programa_asignatura,
                                                    matricula: matricula,
                                                    administrador: administrador,
                                                    login: true,
                                                    name: req.session.name,
                                                    rol: req.session.rol,
                                                    code: req.session.code
                                                });
                                            }
                                        })
                                    })
                                })
                            })
                        })
                    })
                })
            });
        } else {
            res.render('../views/home/home.ejs');
        }
    })
    app.get('/dashboard-administrador', (req, res) => {
        if (req.session.loggedin) {
            connection.query("SELECT * FROM facultad", (err, facultad) => {
                connection.query("SELECT * FROM programa", (error, programa) => {
                    connection.query("SELECT * FROM estudiante", (errors, estudiante) => {
                        connection.query("SELECT * FROM docente", (errors, docente) => {
                            connection.query("SELECT * FROM asignatura", (errors, asignatura) => {
                                connection.query("SELECT * FROM docente_programa_asignatura", (errors, docente_programa_asignatura) => {
                                    connection.query("SELECT * FROM matricula", (errors, matricula) => {
                                        connection.query("SELECT * FROM administrador", (errors, administrador) => {
                                            if (err, error, errors) {
                                                res.send(err, error, errors);
                                            } else {
                                                res.render("../views/global/dashboard-administrador.ejs", {
                                                    facultad: facultad,
                                                    programa: programa,
                                                    estudiante: estudiante,
                                                    docente: docente,
                                                    asignatura: asignatura,
                                                    docente_programa_asignatura: docente_programa_asignatura,
                                                    matricula: matricula,
                                                    administrador: administrador,
                                                    login: true,
                                                    name: req.session.name,
                                                    rol: req.session.rol,
                                                    code: req.session.code
                                                });
                                            }
                                        })
                                    })
                                })
                            })
                        })
                    })
                })
            });
        } else {
            res.render('../views/home/home.ejs');
        }
    })

    /*------------------------------------Error al ingresar una url que no corresponde---------------------------------------------------*/
    app.get('*', (req, res) => {
        res.status(400).render('../views/error/error.ejs', { title: 'No encontrado' })
    })
}
var express = require('express');
var router = express.Router();
var uuid = require('uuid');

module.exports = function(connection) {

    /* Middleware to check whether the user is logged in */
    function isLoggedIn(req, res, next) {
        if(req.session.authenticated) {
            return next();
        } else {
            res.redirect("/login");
        }
    };

    /* GET all the markerSites */
    router.get('/markerSites', function(req, res, next) {

        connection.query("SELECT * FROM atlas", function (error, rows, field) {
            if(!!error){
                console.log(error);
            }
            else{
                //var data  = JSON.stringify(rows);
                res.setHeader('Content-Type', 'application/json');
                res.json(rows);
            }
        });

    });

    /*Get a specific marker with uid parameter*/
    router.get('/marker/:id', function (req, res, next) {

        var id=req.params['id'];
        console.log(id);
        connection.query('select * from atlas where id=?',[id], function (error, rows, field) {

            if(!!error){
                console.log(error);
            }
            else {
                res.setHeader('Content-Type', 'application/json');
                res.json(rows);
                //connection.end();
            }
        })
    });

    router.get('/markers', function (req, res, next) {

        var types=req.query['type'];
        var versions=req.query['versions'];
        var dists=req.query['dists'];
        //console.log(types+versions+dists);
        connection.query('select * from atlas where type=? and openmrs_version=? and distribution=?',[types,versions,dists], function (error, rows, field) {

            if(!!error){
                console.log(error);
            }
            else {
                res.setHeader('Content-Type', 'application/json');
                res.json(rows);
                //connection.end();
            }
        })
    });

    //POST /marker/:id
    router.post('/marker/', isLoggedIn, function (req, res, next) {
        var id=uuid.v4();
        var latitude=req.body.latitude;
        var longitude=req.body.longitude;
        var name=req.body.name;
        var url=req.body.url;
        var type=req.body.type;
        var image=req.body.image;
        var patients=req.body.patients;
        var encounters=req.body.encounters;
        var observations=req.body.observations;
        var contact=req.body.contact;
        var email=req.body.email;
        var notes=req.body.notes;
        var data=req.body.data;
        var atlas_verison=req.body.atlas_version;
        var date_created= new Date().toISOString().slice(0, 19).replace('T', ' ');
        var date_changed=new Date().toISOString().slice(0, 19).replace('T', ' ');
        var created_by=req.body.created_by;
        var show_counts=req.body.show_counts;
        var openmrs_version=req.body.openmrs_version;
        var distribution=req.body.distribution;

        console.log(id+"    "+latitude+longitude+name+url+type+image+patients+encounters+date_changed+"           "+date_created);

        connection.query('insert into atlas values (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)', [id,latitude,longitude,name,url,type,image,patients,encounters,observations,contact,email,notes,data,atlas_verison,date_created,date_changed,created_by,show_counts,openmrs_version,distribution], function (error, rows,field) {
            if(!!error){
                console.log(error);
            }
            else {
                res.setHeader('Content-Type', 'application/json');
                res.json(id);
            }
        });
    });

    router.post('/marker/:id', isLoggedIn, function (req, res, next) {

        var id=req.params['id'];
        var latitude=req.body.latitude;
        var longitude=req.body.longitude;
        var name=req.body.name;
        var url=req.body.url;
        var type=req.body.type;
        var image=req.body.image;
        var patients=req.body.patients;
        var encounters=req.body.encounters;
        var observations=req.body.observations;
        var contact=req.body.contact;
        var email=req.body.email;
        var notes=req.body.notes;
        var data=req.body.data;
        var atlas_verison=req.body.atlas_version;
        var date_created= new Date().toISOString().slice(0, 19).replace('T', ' ');
        var date_changed=new Date().toISOString().slice(0, 19).replace('T', ' ');
        var created_by=req.body.created_by;
        var show_counts=req.body.show_counts;
        var openmrs_version=req.body.openmrs_version;
        var distribution=req.body.distribution;

        console.log(id+"    "+latitude+longitude+name+url+type+image+patients+encounters+date_changed+"           "+date_created);

        connection.query('UPDATE atlas SET latitude=?,longitude=?,name=?,url=?,type=?,image=?,patients=?,encounters=?,observations=?,contact=?,email=?,notes=?,data=?,atlas_version=?,date_created=?,date_changed=?,created_by=?,show_counts=?,openmrs_version=?,distribution=? WHERE id =?', [latitude,longitude,name,url,type,image,patients,encounters,observations,contact,email,notes,data,atlas_verison,date_created,date_changed,created_by,show_counts,openmrs_version,distribution,id], function (error, rows,field) {
            if(!!error){
                console.log(error);
            }
            else {
                res.setHeader('Content-Type', 'application/json');
                res.json(id);
            }
        });
    });

    return router;
};

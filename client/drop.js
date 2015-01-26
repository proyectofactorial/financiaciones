var dict = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
var SHEET_NAME = 'Públicas';

var error = function (args) { console.error (args) };
var warn  = function (args) { console.warn  (args) };
var log   = function (args) { console.log   (args) };

Template.drop.rendered = function () {
        var drop = document.getElementById('container');
        function handleDrop(e) {
                e.stopPropagation();
                e.preventDefault();

                showDropTarget();
                $('.drop i')[0].setAttribute('class', 'fa fa-refresh fa-spin huge');

                var files = e.dataTransfer.files;
                var i,f;
                for (i = 0, f = files[i]; i != files.length; ++i) {
                        var reader = new FileReader();
                        var name = f.name;
                        reader.onload = function(e) {
                                var data = e.target.result;
                                var wb;
                                try {
                                        var cfb = XLS.CFB.read(data, {type: 'binary'});
                                        //var arr = String.fromCharCode.apply(null, new Uint8Array(data));
                                        //var cfb = XLS.CFB.read(btoa(arr), {type: 'base64'});
                                        wb = XLS.parse_xlscfb(cfb);
                                } catch (e) {
                                        wb = XLSX.read(data, {type: 'binary'});
                                }
                                if (!wb) {
                                        return error('Could not read: ' + name);
                                }
                                try {
                                        insertData(parseWB(wb));
                                } catch (err) {
                                        return error (err.message + err.stack);
                                }
                        };
                        reader.readAsBinaryString(f);
                        //reader.readAsArrayBuffer(f);
                }
        }

        function insertData(data) {
                Meteor.call ('reset', 'flines', data);

                //                setTimeout(location.reload, 1000);
                $('.drop i')[0].setAttribute('class', 'fa fa-check huge');
                console.log ("ok, go refresh");

        };

        var mapmap = {
                page: /Página de la guía/,
                name: /Nombre programa/,
                inst: /Instrumento/,
                dest: /Destinatario/,
                dep : /Dependencia/,
                obj : /Objetivos/,
                req : /Requisitos/,
                ben : /Beneficios/,
                nec : /Necesidad a cubrir/,
                mod : /Modalidad/,
                secp: /Sector productivo/,
                tasa: /Tasa/,
                type: /Tipo de tasa/i,
                comp: /Compatible con otros programas/,
                maxc: /Monto max \(\$\)/i,
                maxp: /Monto max \(\%\)/i,
                min : /Monto min/,
                des : /Desembolso/,
                lim : /Lim. Geográfico/,
                poto: /Plazo de otorgamiento/,
                peje: /Plazo de ejecución/,
                cont: /Contacto/
        };

        function parseWB(wb) {
                var fsheet = wb.SheetNames.pop();
                var sheet = wb.Sheets[SHEET_NAME] || wb.Sheets[fsheet];
                var kmap = {};
                var data = [];
                var i = 6;

                if (!sheet)
                        return error ("Can't find sheet: " + SHEET_NAME + ' or ', fsheet);

                _.each (dict, function (k) {
                        var cell = sheet[k + i];
                        if (!cell)
                                return warn ('no cell at ' + k + i);
                        var value = cell.v;
                        if      (! value)
                                return warn ('no value at: ' + k + i);
                        value = value.toString ();

                        var matched = false;
                        _.each (mapmap, function (regex, field) {
                                if (value.match(regex)) {
                                        kmap[field] = k;
                                        matched = true;
                                }
                        });
                        if (!matched)
                                return warn ('ignoring: ' + value);
                });

                /* i is the title, ignore that */;
                for (i = i + 1; sheet[kmap[_.keys(kmap)[0]] + i]; i++) {
                        var value = {};
                        _.each(kmap, function (v, k) {
                                var cell = sheet[v + i];
                                if (!cell) {
                                        error('no data at' + v + i + 'bailing out, I will not parse that line');
                                        return;
                                }
                                value[k] = cell.v;
                        });

                        data.push(value);
                }
                console.log (data);
                return data;
        };

        function handleDragover(e) {
                e.stopPropagation();
                e.preventDefault();
                e.dataTransfer.dropEffect = 'copy';
                showDropTarget();
        }

        function showDropTarget() {
                $('.drop').show();
        };

        function hideDropTarget() {
                $('.drop').hide();
        };

        if(drop.addEventListener) {
                drop.addEventListener('dragenter', handleDragover, false);
                drop.addEventListener('dragover', handleDragover, false);
                drop.addEventListener('drop', handleDrop, false);

                drop.addEventListener('dragleave', hideDropTarget, false);
                drop.addEventListener('dragend', hideDropTarget, false);

        }
};

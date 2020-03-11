(function () {
  "use strict";

  console.log("---------------------")
  console.log("script.js is starting")
  console.log("---------------------\n\n\n")

  function byID(id) {
      return document.getElementById(id);
  }

  function Contact(name, address, phone, email, birthdate, photo) {

    var _name = name;
    var _address = address;
    var _phone = phone;
    var _email = email;
    var _birthdate = birthdate;
    var _photo = photo;

    var  my = {
      name: _name,
      address: _address,
      phone: _phone,
      email: _email,
      birthdate: _birthdate,
      photo: _photo
    };

    my.printPhoto = function (img_class) {
        var photo_string = "";
        if (_photo !== undefined) {
            photo_string += "<img src=\"";
            photo_string += _photo + "\"";
            if (img_class !== undefined) {
                photo_string += " class = \"";
                photo_string += img_class + "\"";
            }
            photo_string += ">";
        }

        return photo_string;
    };

    my.printContact = function () {
        var display_content = "";
        display_content += "<div class=\"listing card bg-light mt-3\">\n";
        display_content += "    ";
        display_content += my.printPhoto("card-img-top") + "\n";
        display_content += "    <div class=\"card-body\">\n";
        display_content += "        <h4 class=\"card-title\">";
        display_content += _name + " </h4>\n";
        display_content += "        <p class=\"card-text\">";
        display_content += _phone + "</p>\n";
        display_content += "        <p class=\"card-text\">";
        display_content += _email + "</p>\n";
        display_content += "        <p class=\"card-text\">";
        display_content += _birthdate + "</p>\n";
        display_content += "        <p class=\"card-text\">";
        display_content += _address + "</p>\n";
        display_content += "    </div>";
        display_content += "</div>";

        return display_content;
    };

    return my;
  }

  function AddressBook() {
    var _contacts = [];
    var _newest_contact_photo = "";

    var my = {
      contacts: _contacts,
      newest_contact_photo: _newest_contact_photo
    };

    my.importObject = function (data) {
        if (Array.isArray(data)) {
            if (data.length) {
                data.forEach(function (contact) {
                    var contact_object = new Contact(
                        contact.name,
                        contact.address,
                        contact.phone,
                        contact.email,
                        contact.birthdate,
                        contact.photo
                    );

                    _contacts = _contacts || [];
                    _contacts.push(contact_object);
                });
            }
        }
    };

    my.writeLocalStorage = function () {
        console.log(_contacts);
        try {
            localStorage.setItem(
                "contacts",
                JSON.stringify(_contacts)
            );
        } catch (e) {
            console.log("localStorage SetItem:" + e);
        }
    };

    my.readLocalStorage = function () {
        try {

            // get the "stringified object array" from localStorage parse
            // the JSON and put the results into our

            var storage = localStorage.getItem("contacts");
            my.importObject(JSON.parse(storage));

        } catch (e) {
            console.log("localStorage GetItem:" + e);
        }
    };

    my.isBirthdateBad = function (birthdate_string) {
        var returnValue = "";
        if (birthdate_string !== undefined) {
            var split_birthdate = birthdate_string.split("/");
            var month = Number(split_birthdate[0]);
            var day = Number(split_birthdate[1]);
            var year = Number(split_birthdate[2]);
            var leap_year = false;
            if (year % 4 === 0) {
                if (year % 100 !== 0) {
                    leap_year = true;
                } else {
                    leap_year = false;
                }
            } else if (year % 400 === 0) {
                leap_year = true;
            }
            var months31 = [1, 3, 5, 7, 8, 10, 12];
            var months30 = [4, 6, 9, 11];

            //alert (month + "/" + day + "/" + year);
            if ((month < 1) || (month > 12)) {
                returnValue = "month";
            } else if (day < 1) {
                returnValue = "day";
            } else if ((months31.includes(month)) && (day > 31)) {
                returnValue = "day";
            } else if ((months30.includes(month)) && (day > 30)) {
                returnValue = "day";
            } else if ((month === 2) && leap_year && (day > 29)) {
                returnValue = "day";
            } else if ((month === 2) && !leap_year && (day > 28)) {
                returnValue = "day";
            } else if ((year < 1900) || (year > 2019)) {
                returnValue = "year";
            }
        }
        return returnValue;

    };

    my.displayAddressBook = function () {
        var to_display = "";
        if (Array.isArray(_contacts)) {
            if (_contacts.length) {
                if (_contacts !== null) {
                    _contacts.forEach(function (contact) {
                        to_display += contact.printContact();
                    });
                }
            }
            var abook = byID("ab-content");
            abook.innerHTML = to_display;
        }
    };

    my.addContact = function () {

        // set valid_contact to true by default!

        var valid_contact = true;
        var name_field = byID("ab-newcontact-fullname");
        var add_name = name_field.value;
        var address_field = byID("ab-newcontact-address");
        var add_address = address_field.value;
        var phone_field = byID("ab-newcontact-phone");
        var add_phone = phone_field.value;
        var email_field = byID("ab-newcontact-email");
        var add_email = email_field.value;
        var birth_field = byID("ab-newcontact-birthday");
        var add_birthdate = birth_field.value;

        var add_photo = _newest_contact_photo;
        console.log(add_photo);

        var valid_name = /^[a-z\u0020,.'\-]+$/i;
        var valid_address = /^[^,]+,[^,]+,\s*[A-Z]{2}\s+\d{5}$/;
        var valid_birthdate = /^[01]\d\/[0-3]\d\/[1-2]\d{3}$/;
        var validate_birthdate = my.isBirthdateBad(add_birthdate);

        if (!valid_name.test(add_name)) {
            alert("not valid name");
            valid_contact = false;
        } else if (add_address.length > 0) {
            if (!valid_address.test(add_address)) {
                alert("not valid address: " + add_address);
                valid_contact = false;
            }
        } else if (add_birthdate.length > 0) {
            if (!valid_birthdate.test(add_birthdate)) {
                alert("not valid birthdate: regular expression");
                valid_contact = false;
            }
        } else if (validate_birthdate) {
            alert("not valid birthdate: " + validate_birthdate);
            valid_contact = false;
        } else if (add_photo === undefined) {
            alert("image is not defined!");
            valid_contact = false;
        } else if (add_photo.length === 0) {
            alert("image is empty");
            valid_contact = false;
        }

        // note the use of the "anonymous" function:
        // returns an array of all matched contacts! Powerful!

        if (Array.isArray(_contacts)) {
            if (_contacts.length) {
                var exists = _contacts.filter(function (contact) {

                    // check to see if "add_name" _contacts!

                    return contact.name === add_name;
                });
                if (exists && (exists.length > 0)) {
                    var warn_msg = "WARNING: ";
                    warn_msg += add_name;
                    warn_msg += " exists in database. Add anyway?";
                    if (!confirm(warn_msg)) {
                        valid_contact = false;
                    }
                }
            }
        }

        if (valid_contact) {
            var new_contact = new Contact(
                add_name,
                add_address,
                add_phone,
                add_email,
                add_birthdate,
                add_photo
            );
            console.log(new_contact);

            // make sure this is an actual array that exists

            _contacts = _contacts || [];
            _contacts.push(new_contact);

            my.writeLocalStorage();

            // clear out the form fields and image after we submit

            byID("ab-contactform").reset();
            byID("ab-displayimage").src = "";
        }
        my.displayAddressBook();
    };

    my.downloadJSON = function () {
        if (Array.isArray(_contacts)) {
            if (_contacts.length) {
                var data = JSON.stringify(_contacts);
                var blob = new Blob([data], {
                    type: "application/json"
                });
                var uri = URL.createObjectURL(blob);
                byID("ab-downloadbutton").setAttribute(
                    "download",
                    "address_book.json"
                );
                byID("ab-downloadbutton").setAttribute(
                    "href",
                    uri
                );
            }
        } else {
            alert("No Download: Address Book is Empty!");
        }
    };

    my.confirmMsg = function (type) {
        var confirm_msg = "WARNING: This will COMPLETELY ";
        confirm_msg += type;
        confirm_msg += " your address book?";
        return confirm(confirm_msg);
    };

    my.deleteAddressBook = function () {
        if (Array.isArray(_contacts)) {
            if (_contacts.length) {
                if (my.confirmMsg("delete")) {
                    try {

                        // get the "stringified object array" from
                        // localStorage parse the JSON into "_contacts"

                        localStorage.removeItem("contacts");

                    } catch (e) {
                        console.log("localStorage removeItem:" + e);
                    }

                    _contacts = [];

                    // we re-display the blank address book to make sure
                    // what's on the screen matches what is in memory!

                    my.displayAddressBook();
                }
            }
        } else {
            alert("Address Book is Empty. Nothing to Delete!");
        }
    };

    my.handleFileSelect = function () {

        // get the first (only in this case) file!

        var image = byID("ab-newcontact-photo").files[0];

        // check to see if the file is a JPEG
        // if it's not, don't even accept the file

        if (image.name.split(".").pop().toLowerCase() !== "jpg") {
            alert("File Must be a jpg!");
        } else {
            var reader = new FileReader();
            reader.onload = function () {

                // newest_contact_photo is a "global" variable

                _newest_contact_photo = reader.result;
                var di = byID("ab-displayimage");
                di.src = _newest_contact_photo;
            };
            reader.readAsDataURL(image);
        }
    };

    // read in contacts from JSON text file

    my.uploadJSON = function () {
        if (my.confirmMsg("replace")) {
            _contacts = [];

            var json_file = byID("ab-uploadjson").files[0];

            var reader = new FileReader();

            reader.onload = function (e) {

                // reads in, parses - and adds to "_contacts"

                my.importObject(JSON.parse(e.target.result));
                my.writeLocalStorage();
                my.displayAddressBook();
                byID("ab-uploadjson").value = "";
            };

            reader.readAsText(json_file);
        }
    };

    var new_btn = byID("ab-newcontact-button");
    var disp_btn = byID("ab-displaybutton");
    var del_btn = byID("ab-deletebutton");
    var download = byID("ab-downloadbutton");
    var upload = byID("ab-uploadjson");
    var new_photo = byID("ab-newcontact-photo-label");

    _contacts = [];
    my.readLocalStorage();
    my.displayAddressBook();

    new_btn.addEventListener("click", my.addContact);
    disp_btn.addEventListener("click", my.displayAddressBook);
    del_btn.addEventListener("click", my.deleteAddressBook);
    download.addEventListener("click", my.downloadJSON);
    upload.addEventListener("change", my.uploadJSON);
    new_photo.addEventListener("change", my.handleFileSelect);

    return my;
  }

  new AddressBook();
}());

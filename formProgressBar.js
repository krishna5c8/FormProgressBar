$.fn.formProgressBar = function(options) {

    var defaults = {
        readCount: false,
        validClass: 'valid',
        invalidClass: 'error',
        percentCounting: false,
        transitionTime: 0,
        height: 10,
        transitionType: 'ease' //ease, linear, ease-in, ease-out, ease-in-out
    };

    var settings = $.extend( {}, defaults, options );

    $('#'+settings.id+'').prepend('<div id='+settings.id+' class="jQueryProgressFormBar"><div></div></div>')
    $('#'+settings.id+'').css("position","relative").css("top",0).css("left",0).css("width","100%").css("height",settings.height).css("z-index",10000)
    $('#'+settings.id+'').css({
        WebkitTransition : 'all '+settings.transitionTime+'ms '+settings.transitionType,
        MozTransition    : 'all '+settings.transitionTime+'ms '+settings.transitionType,
        MsTransition     : 'all '+settings.transitionTime+'ms '+settings.transitionType,
        OTransition      : 'all '+settings.transitionTime+'ms '+settings.transitionType,
        transition       : 'all '+settings.transitionTime+'ms '+settings.transitionType
    }).css("height",settings.height);

    this.elementsRequied = function () {
        var formElements = $(this).find("input, textarea, SELECT").toArray()
        arr = [];
        formElements.map(function (item) {

            arr[item.name] = 0;
            if(item.checked || item.value != '')
                arr[item.name] = 1;
        })
        return arr;
    }
    this.refresh = function () {
        formFields = this.elementsRequied();
    }
    this.renderBar = function () {
        var correctFields = 0
        var length = 0;
        var error = false;

        for(var item in formFields){
            if(formFields[item]==1){
                correctFields++;
            }
            if(formFields[item]==-1)
                error=true;
            length++;
        }

        var percentOfSuccess = (correctFields/length*100).toFixed(2);
        if(settings.percentCounting)
            $('#'+settings.id+'>div').text(Math.round(percentOfSuccess)+" %")
        $('#'+settings.id+'>div').css("width",percentOfSuccess+"%")
        if(error==true)
            $('#'+settings.id+'>div').addClass('warn')
        else
            $('#'+settings.id+'>div').removeClass('warn').removeClass('error')

    }
    this.bindElements = function () {
        var editBar = this.renderBar
        $(this).find("input, textarea, select").change(function () {
            if(!settings.readCount){
                switch ($(this).prop('nodeName')){
                    case "INPUT":
                        switch ($(this).attr("type")){
                            case "text":
                                if($(this).val()!=""){
                                    formFields[$(this).attr("name")]=1
                                }else{
                                    formFields[$(this).attr("name")]=-1
                                }
                                break;
                            case "email":
                                var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
                                if(re.test(String($(this).val()).toLowerCase())){
                                    formFields[$(this).attr("name")]=1
                                }else{
                                    formFields[$(this).attr("name")]=-1
                                }
                                break;
                            case "number":
                                if($.isNumeric($(this).val())){
                                    formFields[$(this).attr("name")]=1
                                }else{
                                    formFields[$(this).attr("name")]=-1
                                }
                                break;
                            case "checkbox":
                                if($(this).is(':checked')){
                                    formFields[$(this).attr("name")]=1
                                }else{
                                    formFields[$(this).attr("name")]=-1
                                }
                                break;
                            case "radio":
                                if($(this).is(':checked')){
                                    formFields[$(this).attr("name")]=1
                                }else{
                                    formFields[$(this).attr("name")]=-1
                                }
                                break;
                        }
                        break;
                    case "SELECT":
                        if($(this).val()!=""){
                            formFields[$(this).attr("name")]=1
                        }else{
                            formFields[$(this).attr("name")]=-1
                        }
                        break;

                }

            }else{
                switch ($(this).attr("type")){
                    case "checkbox":
                        if($(this).is(':checked')){
                            formFields[$(this).attr("name")]=1
                        }else{
                            formFields[$(this).attr("name")]=-1
                        }
                        break;
                    case "radio":
                        if($(this).is(':checked')){
                            formFields[$(this).attr("name")]=1
                        }else{
                            formFields[$(this).attr("name")]=-1
                        }
                        break;
                }
            }
            editBar();
        })

        if(settings.readCount) {
            var $div = $(this).find("input, textarea, select");
            var observer = new MutationObserver(function (mutations) {
                mutations.forEach(function (mutation) {
                    if (mutation.attributeName === "class") {
                        if ($(mutation.target).hasClass(settings.validClass)) {
                            formFields[$(mutation.target).attr("name")] = 1
                        } else if ($(mutation.target).hasClass(settings.invalidClass)) {
                            formFields[$(mutation.target).attr("name")] = -1
                        }
                        editBar();
                    }
                });
            });
            $div.map(function (item) {
                observer.observe($div[item], {
                    attributes: true
                });
            })
        }else{
            this.renderBar();
        }

        $(this).submit(function (e) {
            if($("#jQueryProgressFormBar>div").hasClass('warn')){
                $("#jQueryProgressFormBar>div").removeClass("warn").addClass("error")
                e.preventDefault()
                return
            }
            var correctFields = 0

            for(var item in formFields){
                if(formFields[item]==1){
                    correctFields++;
                }
                length++;
            }
            if(correctFields!=length){
                $("#jQueryProgressFormBar>div").removeClass("warn").addClass("error")
                e.preventDefault()
                return
            }

            $("#jQueryProgressFormBar>div").removeClass("warn").removeClass("error")


        })
    }

    var formFields = this.elementsRequied();



    this.bindElements()

    return this;
};

$.fn.formProgressBar

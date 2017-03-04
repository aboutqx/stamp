//glichText.js
class glichText {
    constructor(t) {
        var n = arguments.length <= 1 || void 0 === arguments[1] ? {} : arguments[1];
        this.$tweakElem = null,
            n.tweakElem && (this.$tweakElem = $(n.tweakElem)),
            this.$el = $(t),
            this.duration = 1,
            this.callback = function() {},
            this.charCodes = ["3", "4", "5", "6", "7", "8", "9", "0", "A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z"],
            this.charLength = 0,
            this.textShown = !1,
            this.duration = 1e3 * this.duration,
            this.intervalDelay = 0,
            this.visible = !1,
            this.shown = !1,
            this.reversing = !1,
            this.progress = 0,
            this.render = this._render.bind(this),
            this.chars = [],
            this.init(),
            this.t = 0,
            this.charOverOffset = 7
    }

    init() {
        var e, t = this;
        e = this.$el,
            e.attr("data-content", e.html()),
            e.addClass("glitch-container"),
            e.blast({
                delimiter: "character"
            });
        var n = [];
        this.$tweakElem && (this.$tweakElem.addClass("glitch-container"),
                this.$tweakElem.blast({
                    delimiter: "character"
                }),
                n = this.$tweakElem.find(".blast")),
            this.$chars = e.find(".blast"),
            this.$chars.each(function(e, i) {
                n[e] ? i.style.width = n[e].getBoundingClientRect().width + "px" : i.style.width = i.getBoundingClientRect().width + "px",
                    i.style.display = "inline-block",
                    t.chars.push({
                        el: i,
                        "char": i.innerHTML
                    })
            }),
            this.charLength = this.chars.length;
        for (var i = 0; i < this.charLength; i++)
            this.chars[i].el.classList.add("glitch-hidden")
    }

    show() {
        var e = this,
            t = arguments.length <= 0 || void 0 === arguments[0] ? null : arguments[0];
        return this.shown = !0,
            1 == this.t ? (this.shown = !1,
                this.visible = !0,
                void(t && t())) : (this.render(),
                void TweenMax.fromTo(this, .8, {
                    t: 0
                }, {
                    t: 1,
                    delay: .1,
                    ease: Power2.easeOut,
                    onComplete: function() {
                        e.t = 1,
                            e.render(),
                            e.shown = !1,
                            e.visible = !0,
                            t && t()
                    }
                }))
    }
    initReverse() {
        !this.reversing && this.visible && (this.reversing = !0,
            this.shown || this.render())
    }
    reset() {
        this.t = 0,
            this.shown = !0,
            this.reversing = !1,
            this.render(),
            this.shown = !1;
        for (var e = 0, t = this.chars.length; t > e; e++) {
            var n = this.chars[e];
            n && (n.el.innerHTML = n["char"],
                n.el.classList.add("glitch-hidden"))
        }
        this.stop()
    }
    stop() {
        TweenMax.killTweensOf(this),
            this.shown = !1
    }
    render() {
        if (this.shown || this.reversing) {
            if (this.progress = this.t,
                this.reversing) {
                for (var e = this.charOverOffset, t = Math.round(this.progress * (this.charLength + 2 * e) - e), n = 0; t - e > n; n++) {
                    var i = this.chars[n];
                    i && (i.el.innerHTML = i["char"],
                        i.el.classList.remove("glitch-hidden"))
                }
                for (var n = t - e + 1; t + e > n; n++) {
                    var i = this.chars[n];
                    i && (i.el.innerHTML = i["char"],
                        i.el.classList.add("glitch-hidden"))
                }
                for (var n = t + e; n < this.charLength; n++) {
                    var i = this.chars[n];
                    i && (i.el.innerHTML = i["char"],
                        i.el.classList.remove("glitch-hidden"))
                }
                this.chars[t - e] && t - e != this.charLength && (this.chars[t - e].el.innerHTML = this.charCodes[Math.floor(Math.random() * this.charCodes.length)]),
                    this.chars[t + e] && t + e != 0 && (this.chars[t + e].el.innerHTML = this.charCodes[Math.floor(Math.random() * this.charCodes.length)])
            } else {
                var t = Math.floor(this.progress * this.charLength);
                t == this.charLength && (t -= 1);
                for (var n = t; n >= 0; n--)
                    this.chars[n].el.innerHTML = this.chars[n]["char"],
                    this.chars[n].el.classList.remove("glitch-hidden");
                for (var n = this.charLength - 1; n > t; n--)
                    this.chars[n].el.classList.add("glitch-hidden");
                t != this.charLength - 1 && (this.chars[t].el.innerHTML = this.charCodes[Math.floor(Math.random() * this.charCodes.length)])
            }
            window.requestAnimationFrame(this.render)
        }
    }
}

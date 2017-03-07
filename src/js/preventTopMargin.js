document.addEventListener("DOMContentLoaded", function() {
    // window.addEventListener("touchstart", function(e) {
    //     e.preventDefault()
    // }, { passive: false }),
    document.addEventListener("touchmove", function(e) {
        e.preventDefault()
    }, { passive: false })
})
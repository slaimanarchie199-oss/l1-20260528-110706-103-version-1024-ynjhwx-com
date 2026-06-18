(function () {
    function ready(fn) {
        if (document.readyState === "loading") {
            document.addEventListener("DOMContentLoaded", fn);
        } else {
            fn();
        }
    }

    ready(function () {
        var toggle = document.querySelector(".nav-toggle");
        if (toggle) {
            toggle.addEventListener("click", function () {
                var opened = document.body.classList.toggle("nav-open");
                toggle.setAttribute("aria-expanded", opened ? "true" : "false");
            });
        }

        document.querySelectorAll(".mobile-nav a").forEach(function (link) {
            link.addEventListener("click", function () {
                document.body.classList.remove("nav-open");
                if (toggle) {
                    toggle.setAttribute("aria-expanded", "false");
                }
            });
        });

        document.querySelectorAll(".js-hero-slider").forEach(function (slider) {
            var slides = Array.prototype.slice.call(slider.querySelectorAll(".hero-slide"));
            var dots = Array.prototype.slice.call(slider.querySelectorAll(".hero-dot"));
            var index = 0;
            var timer = null;

            function show(nextIndex) {
                if (!slides.length) {
                    return;
                }
                index = (nextIndex + slides.length) % slides.length;
                slides.forEach(function (slide, i) {
                    slide.classList.toggle("is-active", i === index);
                });
                dots.forEach(function (dot, i) {
                    dot.classList.toggle("is-active", i === index);
                });
            }

            function start() {
                stop();
                timer = window.setInterval(function () {
                    show(index + 1);
                }, 5200);
            }

            function stop() {
                if (timer) {
                    window.clearInterval(timer);
                    timer = null;
                }
            }

            dots.forEach(function (dot, i) {
                dot.addEventListener("click", function () {
                    show(i);
                    start();
                });
            });

            slider.addEventListener("mouseenter", stop);
            slider.addEventListener("mouseleave", start);
            show(0);
            start();
        });

        document.querySelectorAll(".filterable").forEach(function (scope) {
            var input = scope.querySelector(".js-filter-input");
            var yearSelect = scope.querySelector(".js-year-filter");
            var regionSelect = scope.querySelector(".js-region-filter");
            var categorySelect = scope.querySelector(".js-category-filter");
            var cards = Array.prototype.slice.call(scope.querySelectorAll(".movie-card"));
            var empty = scope.querySelector(".js-empty");
            var resultText = scope.querySelector(".js-result-text");
            var years = [];
            var regions = [];

            cards.forEach(function (card) {
                var year = card.getAttribute("data-year");
                var region = card.getAttribute("data-region");
                if (year && years.indexOf(year) === -1) {
                    years.push(year);
                }
                if (region && regions.indexOf(region) === -1) {
                    regions.push(region);
                }
            });

            years.sort(function (a, b) {
                return Number(b) - Number(a);
            });
            regions.sort();

            if (yearSelect) {
                years.forEach(function (year) {
                    var option = document.createElement("option");
                    option.value = year;
                    option.textContent = year;
                    yearSelect.appendChild(option);
                });
            }

            if (regionSelect) {
                regions.forEach(function (region) {
                    var option = document.createElement("option");
                    option.value = region;
                    option.textContent = region;
                    regionSelect.appendChild(option);
                });
            }

            function runFilter() {
                var query = input ? input.value.trim().toLowerCase() : "";
                var yearValue = yearSelect ? yearSelect.value : "";
                var regionValue = regionSelect ? regionSelect.value : "";
                var categoryValue = categorySelect ? categorySelect.value : "";
                var visible = 0;

                cards.forEach(function (card) {
                    var text = (card.getAttribute("data-search") || "").toLowerCase();
                    var matchesQuery = !query || text.indexOf(query) !== -1;
                    var matchesYear = !yearValue || card.getAttribute("data-year") === yearValue;
                    var matchesRegion = !regionValue || card.getAttribute("data-region") === regionValue;
                    var matchesCategory = !categoryValue || card.getAttribute("data-category") === categoryValue;
                    var keep = matchesQuery && matchesYear && matchesRegion && matchesCategory;
                    card.hidden = !keep;
                    if (keep) {
                        visible += 1;
                    }
                });

                if (empty) {
                    empty.hidden = visible !== 0;
                }
                if (resultText) {
                    resultText.textContent = query || yearValue || regionValue || categoryValue ? "筛选结果已更新。" : "输入关键词后即可筛选影片。";
                }
            }

            [input, yearSelect, regionSelect, categorySelect].forEach(function (el) {
                if (el) {
                    el.addEventListener("input", runFilter);
                    el.addEventListener("change", runFilter);
                }
            });
        });
    });
})();

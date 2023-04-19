let infinite_scroll = new function () {
    let self = this;
    let InfinityScrollUtils = {
        ticking: false,
        page: 2,
        getScrollPosition: function () {
            let s = $(window).scrollTop(),
                d = $(document).height(),
                c = $(window).height();


            return (s / (d - c)) * 100;
        },
        generateNewTableRow: function (item) {
            let tableRow = document.createElement('tr');
            let producerNameTD = document.createElement('td');
            let colorNameTD = document.createElement('td');
            let SizeNameTD = document.createElement('td');
            let TypeNameTD = document.createElement('td');
            let YearTD = document.createElement('td');
            let DetailsTD = document.createElement('td');

            producerNameTD.innerText = item.producerName;
            tableRow.appendChild(producerNameTD);

            colorNameTD.innerText = item.colorName;
            tableRow.appendChild(colorNameTD);

            SizeNameTD.innerText = item.sizeName;
            tableRow.appendChild(SizeNameTD);

            TypeNameTD.innerText = item.typeName;
            tableRow.appendChild(TypeNameTD);

            YearTD.innerText = item.year;

            let details = document.createElement('button');
            details.onclick = function (e) {
                window.location.href = `/Offer/GoToOfferDetailsPage/${item.offerId}`;
            }
            details.textContent = "Details";
            details.className = "btn btn-primary"
            tableRow.appendChild(YearTD);
            DetailsTD.appendChild(details);
            tableRow.appendChild(DetailsTD);
            return tableRow;
        }
    }


    self.InfinityScroll = () => {
        if (InfinityScrollUtils.getScrollPosition() > 30) {
            if (!InfinityScrollUtils.ticking) {
                $.ajax({
                    url: "/Offer/GetOffersPerPage?page=" + InfinityScrollUtils.page,
                }).done(function (data) {
                    const tableBody = $("#tabel>tbody");
                    data.forEach(function (item) {
                        tableBody.append(InfinityScrollUtils.generateNewTableRow(item));
                    })
                    InfinityScrollUtils.page = InfinityScrollUtils.page + 1;
                    InfinityScrollUtils.ticking = false;
                }).fail(function (xhr, textStatus, errorThrown) {
                    debugger;
                    console.log('Bad stuff happened');
                    InfinityScrollUtils.ticking = false;
                })
                InfinityScrollUtils.ticking = true;


            }
        }
    }
};
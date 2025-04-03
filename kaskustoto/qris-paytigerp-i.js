/*
  TTTTT  III  GGG   EEEEE  RRRR     DDDD   EEEEE  V   V  SSSS
    T     I   G      E      R   R    D   D  E      V   V  S
    T     I   G  GG  EEEE   RRRR     D   D  EEEE   V   V  SSS
    T     I   G   G  E      R  R     D   D  E      V   V     S
    T    III  GGGG   EEEEE  R   R    DDDD   EEEEE  VVV   SSSS

               QRIS API IDNTOTO TIGER_DEVS X PRESTIGE v.1
*/


document.addEventListener("DOMContentLoaded", () => {
  const fullUrl = window.location.href;
  const qrisQueryUrl = new URLSearchParams(window.location.search);

  // PGA IDNTOTO
  if (
    (CONFIGQRIS.status === "ON" && fullUrl.endsWith("/cashier")) ||
    qrisQueryUrl.get("getqris")
  ) {
    const findTabDeposit = $("#bankTabs");

    if (findTabDeposit) {
      const checkingBtnBank = setInterval(() => {
        const findBankBtn = $("#mop-bank");
        const idnQrisDefaultBtn = $("#mop-qrispayment");
        const olxQris = $("#dynQrisBtn");
        const elementSelectorwithoutHash = CONFIGQRIS.elementSelector.replace(
          /^#/,
          ""
        );

        $("#bank").after(
          `<div id="${elementSelectorwithoutHash}" style="display: none;"></div>`
        );

        $(CONFIGQRIS.elementSelector).hide();

        // Bank Button Clicked
        findBankBtn.on("click", function () {
          window.location.href = "/cashier";
        });

        // QRIS OLX Btn Clicked
        olxQris.on("click", function () {
          $(CONFIGQRIS.elementSelector).hide();
        });

        // QRIS Default IDN Clicked
        idnQrisDefaultBtn.on("click", function () {
          $(CONFIGQRIS.elementSelector).hide();
        });

        if (findBankBtn.length > 0) {
          if ($("#mop-bank").next(".cstmnewqris").length === 0) {
            if (CONFIGQRIS.showbutton === "ON") {
              // Creating the Button inside the Default Payment Tab
              const createQrisBtnCstm = $("<a>", {
                href: "/cashier?getqris=true",
                class: "cstmnewqris",
                text: CONFIGQRIS.qrisbtntext,
              });

              const qrisImg = $("<img>", {
                src: CONFIGQRIS.qrisIcon,
                class: "qrisimgBaru",
              });

              createQrisBtnCstm.append(qrisImg);
              $(findBankBtn).after(createQrisBtnCstm);
            }

            // Apply styles to the Default tab
            findTabDeposit.css({
              "grid-template-columns": "1fr 1fr 1fr",
              "margin-bottom": "1rem",
            });

            // When the QRIS button CLICKED / ACCESS
            const checkQrisUrl = qrisQueryUrl.get("getqris");

            if (checkQrisUrl) {
              $("#bank").hide();
              $(CONFIGQRIS.elementSelector).show();
            }

            // Selecting Banks
            setInterval(() => {
              const selectedBanks = $(".dd-selected-text").html();

              const allBanks = $(
                "#bank > div:nth-child(7), #bank > div:nth-child(8), #bank > div:nth-child(9), #bank > div:nth-child(13), #bank > div:nth-child(15)"
              );

              const depoIbanking = $(".depo-ibanking");

              if (CONFIGQRIS.qrisbank.includes(selectedBanks)) {
                allBanks.hide();

                depoIbanking.hide();
                depoIbanking.next("hr").hide();
                depoIbanking.nextAll("div").slice(0, 6).hide();

                if (
                  $(".dd-options.dd-click-off-close").css("display") === "block"
                ) {
                  $(CONFIGQRIS.elementSelector).css("height", "880px");
                } else {
                  $(CONFIGQRIS.elementSelector).css("height", "auto");
                }

                $(CONFIGQRIS.elementSelector).show();
              } else {
                allBanks.show();
                if (fullUrl.endsWith("/cashier")) {
                  $(CONFIGQRIS.elementSelector).hide();
                }
                depoIbanking.show();
                depoIbanking.next("hr").show();
                depoIbanking.nextAll("div").slice(0, 6).show();
              }
            }, 200);

            clearInterval(checkingBtnBank);
          }
        }
      }, 100);
    }
  }

  // End Inject into Website

  const qriscss = document.createElement("link");
  qriscss.rel = "stylesheet";
  qriscss.href = CONFIGQRIS.qriscssfile;
  qriscss.type = "text/css";

  document.head.appendChild(qriscss);

  const dataLocals = getLocalData("pendingqris");
  const qrisWrapperPending = $(CONFIGQRIS.elementPendingSelector);

  if (!dataLocals) {
    qrisBody();
  } else {
    $.ajax({
      url: `${
        CONFIGQRIS.env === "DEBUG"
          ? "server/view-transaction.php"
          : `${CONFIGQRIS.apiurl}/server/view-transaction.php`
      }`,
      type: "POST",
      data: {
        transactionid: dataLocals.tid,
      },
      success: (response) => {
        if (response.tid) {
          localStorage.removeItem("pendingqris");
          alert(CONFIGQRIS.successdepo);
          window.location.reload();
        } else {
          qrisWrapperPending.html(`<div class="tigerp-qris-wrapper">
                <img width="${CONFIGQRIS.qrisIconWidth}" heigth="${
            CONFIGQRIS.qrisIconHeight
          }" class="tigerp-logo-qris" src="${CONFIGQRIS.qrisIcon}" />

         <div class="tigerp-notice tigerp-success-notice">
         <div class="tigerp-qris-image-wrapper">
                <img src="${dataLocals.qrimage}" class="tigerp-qr-image" />
                <button onclick="downloadQris('${dataLocals.qrimage}', '${
            CONFIGQRIS.siteName
          }_${dataLocals.tid}')" type="button">Download QR</button>
                <p>${CONFIGQRIS.pendingqris}</p>
                <p>Terima kasih sudah deposit di ${
                  CONFIGQRIS.siteName
                }. Semoga beruntung!</p>
                </div>
              </div>

              <div class="tigerp-desc-total">
            <div>
            <p>Total Pembayaran:</p>
            <p>Rp. ${Number(dataLocals.nominal).toLocaleString()}</p>
            </div>
       </div>
        </div>`);
        }
      },
    });
  }
});

function qrisBody() {
  const validation = setTimeout(() => {
    const usernameElement = document.querySelector(".mb-lobby-username");
    const usernameMember = usernameElement ? usernameElement.innerHTML : null;
    const loadingElement = `<div class="tigerp-loading-text"><div class="tigerp-loader"></div> <p>Mohon ditunggu, system ${CONFIGQRIS.siteName} sedang proses permintaan anda...</p></div>`;

    if (
      window.jQuery &&
      CONFIGQRIS &&
      CONFIGQRIS.elementSelector &&
      usernameMember &&
      CONFIGQRIS.status === "ON"
    ) {
      const qrisWrapper = $(CONFIGQRIS.elementSelector);
      let jumlahDepoQris = 0;

      const qrisFormContent = `<form id="tigerp-form-qris" class="tigerp-qris-wrapper">
        <img width="${CONFIGQRIS.qrisIconWidth}" heigth="${CONFIGQRIS.qrisIconHeight}" class="tigerp-logo-qris" src="${CONFIGQRIS.qrisIcon}" />
         <div class="tigerp-notice tigerp-info-notice">
        <p>${CONFIGQRIS.noticeText}</p>
        </div>


        <input type="hidden" value="${usernameMember}" placeholder="Username..." name="qrisusername"/>
      <div class="tigerp-input-wrapper">
       <p>Rp.</p> <input id="tigerp-jumlahqris" type="text" placeholder="0" required/>
      </div>
       <div class="tigerp-desc-total">

            <div>
            <p>Total Pembayaran</p>
            <p id="tigerp-total-pembayaran">${jumlahDepoQris}</p>
            </div>
       </div>
       <button type="submit">Submit Deposit</button>
        </form>`;

      qrisWrapper.html(qrisFormContent);

      const jumlahInput = $("#tigerp-jumlahqris");
      const jumlahWrapper = $(".tigerp-input-wrapper");
      const formQris = $("#tigerp-form-qris");
      const formQrisBtn = $("#tigerp-form-qris button[type='submit']");
      const noticeWrapper = $(".tigerp-notice");

      jumlahInput.on("input", (response) => {
        jumlahDepoQris = Number(response.target.value.replace(/[^0-9]/g, ""));
        jumlahInput.val(jumlahDepoQris.toLocaleString());

        $("#tigerp-total-pembayaran").text(
          Number(jumlahDepoQris).toLocaleString()
        );
      });

      formQris.submit((e) => {
        e.preventDefault();

        noticeWrapper.each(function () {
          $(this).attr("class", "tigerp-notice");
        });

        jumlahInput.removeClass("tigerp-border-red");

        if (jumlahDepoQris >= CONFIGQRIS.minimalDeposit) {
          $.ajax({
            type: "POST",
            url: `${
              CONFIGQRIS.env === "DEBUG"
                ? "server/create-qris.php"
                : `${CONFIGQRIS.apiurl}/server/create-qris.php`
            }`,
            data: {
              username: usernameMember,
              nominal: jumlahDepoQris,
            },
            beforeSend: () => {
              noticeWrapper.addClass("tigerp-warning-notice");
              formQrisBtn.prop("disabled", true);
              jumlahInput.prop("disabled", true);

              formQrisBtn.css({
                opacity: 0.5,
              });

              noticeWrapper.html(loadingElement);
            },

            success: (response) => {
              noticeWrapper.removeClass("tigerp-warning-notice");
              noticeWrapper.addClass("tigerp-success-notice");
              formQrisBtn.hide();
              jumlahWrapper.hide();
              setLocalData("pendingqris", response, CONFIGQRIS.durasipending);
              noticeWrapper.html(`
                <div class="tigerp-qris-image-wrapper">
                <img src="${response.qrimage}" class="tigerp-qr-image" />
                <button onclick="downloadQris('${response.qrimage}', '${CONFIGQRIS.siteName}_${response.tid}')" type="button">Download QR</button>
                <p>${CONFIGQRIS.successqris}</p>
                <p>Terima kasih sudah deposit di ${CONFIGQRIS.siteName}. Semoga beruntung!</p>
                </div>
                `);
            },

            error: () => {
              noticeWrapper.removeClass("tigerp-warning-notice");
              noticeWrapper.addClass("tigerp-danger-notice");
              noticeWrapper.html(
                `<p>System sedang gangguan, Silahkan dicoba lagi kembali :(</p>`
              );
            },
            complete: () => {
              formQrisBtn.prop("disabled", false);
              formQrisBtn.css({
                opacity: 1,
              });
              jumlahInput.prop("disabled", false);
            },
          });
        } else {
          noticeWrapper.addClass("tigerp-danger-notice");
          jumlahInput.addClass("tigerp-border-red");

          noticeWrapper.html(
            `<p>Mohon maaf, Minimal Deposit ${CONFIGQRIS.siteName}: Rp.${Number(
              CONFIGQRIS.minimalDeposit
            ).toLocaleString()}. Silahkan diisi kembali dengan nominal yang benar.</p>`
          );
        }
      });

      clearTimeout(validation);
    }
  }, 500);
}

function downloadQris(base64Data, filename) {
  let a = document.createElement("a");
  a.href = base64Data;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}

function setLocalData(key, value, expiryMinutes) {
  const now = new Date();
  const item = {
    value: value,
    expiry: now.getTime() + expiryMinutes * 60 * 1000,
  };
  localStorage.setItem(key, JSON.stringify(item));
}

function getLocalData(key) {
  const itemStr = localStorage.getItem(key);
  if (!itemStr) {
    return null;
  }

  const item = JSON.parse(itemStr);
  const now = new Date();

  if (now.getTime() > item.expiry) {
    localStorage.removeItem(key);
    return null;
  }
  return item.value;
}

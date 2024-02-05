import { ClockIconSrc, defaultAvatar, LiveIconSrc } from "assets";
import { toastMessage } from "shared/components/toast";

const classNames = require("classnames");
function roundNum(number: string, decPlaces: number) {
  // 2 decimal places => 100, 3 => 1000, etc
  decPlaces = Math.pow(10, decPlaces);

  // Enumerate number abbreviations
  var abbrev = ["k", "m", "b", "t"];

  // Go through the array backwards, so we do the largest first
  for (var i = abbrev.length - 1; i >= 0; i--) {
    // Convert array index to "1000", "1000000", etc
    var size = Math.pow(10, (i + 1) * 3);

    // If the number is bigger or equal do the abbreviation
    if (size <= Number(number)) {
      // Here, we multiply by decPlaces, round, and then divide by decPlaces.
      // This gives us nice rounding to a particular decimal place.
      number = String(
        Math.round((Number(number) * decPlaces) / size) / decPlaces
      );

      // Handle special case where we round up to the next abbreviation
      if (Number(number) === 1000 && i < abbrev.length - 1) {
        number = String(1);
        i++;
      }

      // Add the letter for the abbreviation
      number += abbrev[i];

      // We are done... stop
      break;
    }
  }

  return number;
}
const SUPPORTED_FORMATS = ["image/jpg", "image/jpeg", "image/gif", "image/png"];
const SUPPORTED_VIDEO_FORMATS = ["video/mp4", "video/x-m4v", "video/*"];
function checkFileType(filetype: string): boolean {
  if (SUPPORTED_FORMATS.includes(filetype)) {
    return true;
  } else {
    return false;
  }
}
function checkVideoType(filetype: string): boolean {
  if (SUPPORTED_VIDEO_FORMATS.includes(filetype)) {
    return true;
  } else {
    return false;
  }
}

function isNumberCheck(e: any) {
  e = e || window.event;
  var charCode = e.which ? e.which : e.keyCode;
  return /\d/.test(String.fromCharCode(charCode));
}

const fullScreenInnerHTMLText = (
  streamDetail: any,
  watching: any,
  time: any
) => {
  let text = `<div class="vjs-title-bar-full-screen-container">
          <div class="vjs-title-bar-profile-container col-9">
            <div class="vjs-title-bar-profile-conatiner-img-container">
              <img src=${
                streamDetail?.user?.avatar
                  ? streamDetail?.user?.social_login_id
                    ? streamDetail?.user?.avatar
                    : streamDetail?.profile_image_base_url +
                      streamDetail?.user?.avatar
                  : defaultAvatar
              } class="vjs-title-bar-profile-img"/>
            </div>
            <div class="vjs-title-bar-profile-container-text-container ">
              <label class="vjs-title-bar-profile-container-text-title ">
               ${
                 streamDetail?.user?.first_name +
                 " " +
                 streamDetail?.user?.last_name
               }
              </label>
              <label class="vjs-title-bar-profile-container-text-subtitle">
                @${streamDetail?.user?.user_name}
              </label>
              <label class="vjs-title-bar-profile-container-text-description">
                ${streamDetail?.title}
              </label>
            </div>
          </div>
          <div class="vjs-title-bar-stats-container col-3">
          ${
            streamDetail?.is_live
              ? `<div class="vjs-title-bar-stats-container-status-container">
               <img src=${LiveIconSrc} />
              <label class="vjs-title-bar-stats-container-status-container-text">
                Live
              </label>
            </div>
            `
              : ""
          }
            <div class="vjs-title-bar-stats-container-viewer-counter-container">
              <div class="vjs-title-bar-stats-containerr-viewer-counter-status-container">
                <img src=${ClockIconSrc} class="vjs-title-bar-stats-container-viewer-counter-icon"  />
                <label class="vjs-title-bar-stats-container-viewer-counter-container-text">
                  ${
                    streamDetail?.is_live
                      ? `${time}`
                      : `${streamDetail?.length}`
                  }
                </label>
              </div>
              <div class="vjs-title-bar-stats-containerr-viewer-counter-status-container">
                <label class="vjs-title-bar-stats-container-viewer-counter-container-text">
                  ${roundNum(
                    streamDetail?.is_live ? watching : streamDetail?.views,
                    1
                  )}
                </label>
                <label class="vjs-title-bar-stats-container-viewer-counter-container-text">
                ${streamDetail?.is_live ? "Watching" : "Views"} 
                </label>
              </div>
            </div>
          </div>
        </div>`;
  return text;
};

const mediumScreenInnerHTMLText = (
  streamDetail: any,
  watching: any,
  time: any
) => {
  let text = `<div class="vjs-title-bar-full-medium-container">
          <div class="vjs-title-bar-stats-container">
            <div class="vjs-title-bar-stats-container-viewer-counter-container">
              <div class="vjs-title-bar-stats-containerr-viewer-counter-status-container">
                <label class="vjs-title-bar-stats-container-viewer-counter-container-text">
                 ${roundNum(
                   streamDetail?.is_live ? watching : streamDetail?.views,
                   1
                 )}
                </label>
                <label class="vjs-title-bar-stats-container-viewer-counter-container-text">
                 ${streamDetail?.is_live ? "Watching" : "Views"} 
                </label>
              </div>
               <div class="vjs-title-bar-stats-containerr-viewer-counter-status-container">
                <img src=${ClockIconSrc} class="vjs-title-bar-stats-container-viewer-counter-icon"  />
                <label class="vjs-title-bar-stats-container-viewer-counter-container-text">
                ${
                  streamDetail?.is_live ? `${time}` : `${streamDetail?.length}`
                }    
                </label>
              </div>
            </div>
          </div>
        </div>`;
  return text;
};
const createStripeToken = (stripeDtail: any, callback: any) => {
  (window as any).Stripe.createToken(
    {
      number: stripeDtail?.number,
      cvc: stripeDtail?.cvc,
      exp_month: stripeDtail?.exp_month,
      exp_year: stripeDtail?.exp_year,
      name: stripeDtail?.name,
    },
    function (result: any, response: any) {
      if (response?.hasOwnProperty("error")) {
        toastMessage("error", response?.error?.message);
        callback({ status: false, data: null });
      } else {
        if (response.hasOwnProperty("id")) {
          // let obj = {
          //   stripe_token: response.id,
          //   pm_last_four: response.card.last4,
          //   card_holder_name: stripeDtail?.name,
          //   expire_date: stripeDtail?.expiry
          // }
          callback({ status: true, data: response });
        }
      }
      // Handle result.error or result.token
    }
  );
};
function padTo2Digits(num: number) {
  return num.toString().padStart(2, "0");
}

export {
  roundNum,
  classNames,
  checkFileType,
  fullScreenInnerHTMLText,
  mediumScreenInnerHTMLText,
  checkVideoType,
  isNumberCheck,
  createStripeToken,
  padTo2Digits,
};

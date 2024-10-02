document.querySelectorAll('input[name="option"]').forEach((radio) => {
  radio.addEventListener('change', () => {
    if (radio.value === 'Indoor') {
      document.body.style.backgroundImage =
        "url('https://res.cloudinary.com/dbriapahp/image/upload/v1726920498/bg_zpmyuv.jpg')";
    } else {
      document.body.style.backgroundImage =
        'url(https://res.cloudinary.com/izynegallardo/image/upload/v1727086659/download_f51euz.gif)';
    }
  });
});

const triangularMF = (x, a, b, c) => {
  if (x <= a || x >= c) {
    return 0;
  } else if (a <= x && x <= b) {
    return (x - a) / (b - a);
  } else if (b <= x && x <= c) {
    return (c - x) / (c - b);
  }
};
const computeAmbientColor = (lightIntensity) => {
  const redDark = triangularMF(lightIntensity, 0, 25, 50);
  const redMed = triangularMF(lightIntensity, 25, 50, 75);
  const redBright = triangularMF(lightIntensity, 50, 75, 100);
  const greenDark = triangularMF(lightIntensity, 0, 25, 50);
  const greenMed = triangularMF(lightIntensity, 25, 50, 75);
  const greenBright = triangularMF(lightIntensity, 50, 75, 100);
  const blueDark = triangularMF(lightIntensity, 0, 25, 50);
  const blueMed = triangularMF(lightIntensity, 25, 50, 75);
  const blueBright = triangularMF(lightIntensity, 50, 75, 100);
  const numRed = redDark * 25 + redMed * 128 + redBright * 255;
  const divRed = redDark + redMed + redBright;
  const numGreen = greenDark * 25 + greenMed * 128 + greenBright * 255;
  const divGreen = greenDark + greenMed + greenBright;
  const numBlue = blueDark * 25 + blueMed * 128 + blueBright * 255;
  const divBlue = blueDark + blueMed + blueBright;
  if (
    0 >= numBlue ||
    0 >= divBlue ||
    0 >= numGreen ||
    0 >= divGreen ||
    0 >= numRed ||
    0 >= divRed
  ) {
    return 0;
  }
  const red = numRed / divRed;
  const green = numGreen / divGreen;
  const blue = numBlue / divBlue;
  return {
    red: parseInt(red),
    green: parseInt(green),
    blue: parseInt(blue),
  };
};

const computeOpacity = (lightIntensity) => {
  const lowOpacity = triangularMF(lightIntensity, 0, 25, 50);
  const medOpacity = triangularMF(lightIntensity, 25, 50, 75);
  const highOpacity = triangularMF(lightIntensity, 50, 75, 100);
  const numOpacity = lowOpacity * 0.1 + medOpacity * 0.5 + highOpacity * 1.0;
  const divOpacity = lowOpacity + medOpacity + highOpacity;

  if (divOpacity <= 0) {
    return 0;
  }
  const opacity = numOpacity / divOpacity;

  return Math.max(0, Math.min(1, opacity));
};

let slider = document.getElementById('myRange');
let output = document.getElementById('demo');
let lightIntensity = 1;
const ceiling = document.getElementById('ceiling-light');
const luminous = document.getElementById('luminousity');
const transparency = document.getElementById('transparency');
const bulb = document.getElementById('bulb-light');

const memo = [];

const lightSwitch = document.getElementsByName('light-option');
const lightSwitchOFf = document.getElementById('Off');
const lightRadios = document.getElementById('lightRadios');
const shadow = document.getElementsByClassName('shadow');

function updateBulb(rangeValue) {
  const minValue = 2.55 * rangeValue;
  const reversedValue = 100 - rangeValue;
  const shadowSize = (rangeValue / 100) * 50;

  for (let i = 0; i < shadow.length; i++) {
    shadow[i].style.opacity = reversedValue / 100;
    shadow[i].style.boxShadow = `
      0 ${shadowSize}px ${shadowSize}px ${shadowSize}px rgba(0, 0, 0, ${
      reversedValue / 100
    })
    `;
    console.log('Shadow-box:', shadow[i].style.boxShadow);
    shadow[i].style.transition = '2s';
  }

  const onLight = rangeValue >= 63;
  const dimLight = rangeValue >= 38 && rangeValue < 63;

  const bulbShadowSize = (rangeValue / 100) * 500 + 'px';
  const bulbShadowSpread = (rangeValue / 100) * 100 + 'px';

  let lightSwitchValue = 0;
  for (let i = 0; i < lightSwitch.length; i++) {
    if (lightSwitch[i].checked) {
      lightSwitchValue = lightSwitch[i].value;
      break;
    }
  }

  if (onLight) {
    bulb.style.boxShadow = `0px 10px ${bulbShadowSize} ${bulbShadowSpread} rgb(${minValue}, ${minValue}, ${minValue})`;
    bulb.style.backgroundColor = `rgb(${minValue}, ${minValue}, ${minValue})`;
  } else if (dimLight) {
    bulb.style.boxShadow = `0px 7.5px 375px 75px rgb(${minValue * 1.5}, ${
      minValue * 1.5
    }, 0)`;
    bulb.style.backgroundColor = `rgb(${minValue * 2}, ${minValue * 2}, 0)`;
  } else {
    bulb.style.boxShadow = `0px 7.5px 375px 75px rgb(${minValue * 1.5}, ${
      minValue * 1.5
    }, 0)`;
    bulb.style.backgroundColor = `rgb(${minValue * 1.5}, ${minValue * 1.5}, 0)`;
  }
}

window.onload = function () {
  slider.min = 25;
  slider.max = 37;
  slider.value = slider.min;
  output.innerHTML = slider.value;

  updateBulb(parseInt(slider.value, 10));

  slider.oninput = function () {
    const reversedValue = 75 - parseInt(this.value, 10);
    const shadowSize = (parseInt(this.value, 10) + 1) * 2 + 'px';
    const transValue = 60 - parseInt(this.value, 10);
    lightIntensity = (parseInt(this.value, 10) + 1) % 101;
    const ambientColor = computeAmbientColor(reversedValue);
    console.log(ambientColor);
    const compOpacity = computeOpacity(transValue);
    console.log(compOpacity);
    const luminousCompOpacity = computeOpacity(75 - parseInt(this.value, 10));

    transparency.style.opacity = reversedValue / 100;
    luminous.style.boxShadow = `0 0 ${shadowSize} ${shadowSize} rgba(${
      ambientColor.red - 50
    }, ${ambientColor.green - 50}, ${
      ambientColor.blue - 50
    }, ${luminousCompOpacity})`;
    transparency.style.opacity = compOpacity;
    luminous.style.transition = '1.2s';
    transparency.style.transition = 'opacity 2s';

    output.innerHTML = this.value;
    updateBulb(parseInt(this.value, 10));
  };

  let lastState = 'low';

  for (let i = 0; i < lightSwitch.length; i++) {
    lightSwitch[i].addEventListener('change', function () {
      if (lightSwitch[0].checked) {
        slider.min = 25;
        slider.max = 37;
        slider.value =
          lastState === 'meduim' || lastState === 'high'
            ? slider.max
            : slider.min;
        lastState = 'low'; 
      } else if (lightSwitch[1].checked) {
        slider.min = 38;
        slider.max = 62;
        slider.value = lastState === 'low' ? slider.min : slider.max;
        lastState = 'meduim'; 
      } else if (lightSwitch[2].checked) {
        slider.min = 63;
        slider.max = 100;
        slider.value =
          lastState === 'low' || lastState === 'meduim'
            ? slider.min
            : slider.max;
        lastState = 'high'; 
      }
      
      output.innerHTML = slider.value;
      updateBulb(parseInt(slider.value, 10));
    });
  }
};

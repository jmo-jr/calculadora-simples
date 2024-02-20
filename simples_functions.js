/*
 * Ajuste decimal de um número.
 * https://github.com/rubengmurray/expected-round
 *
 * @param  {String}  type  O tipo de arredondamento.
 * @param  {Number}  value  O número a arredondar.
 * @param  {Integer}  exp    O expoente (o logaritmo decimal da base pretendida).
 * @returns  {Number}      O valor depois de ajustado.
 */
function decimalAdjust(type, value, exp) {
  if (typeof exp === 'undefined' || +exp === 0) {
    return Math[type](value);
  }
  value = +value;
  exp = +exp;

  if (isNaN(value) || !(typeof exp === 'number' && exp % 1 === 0)) {
    return NaN;
  }

  value = value.toString().split('e');
  value = Math[type](+(value[0] + 'e' + (value[1] ? (+value[1] - exp) : -exp)));

  value = value.toString().split('e');
  return +(value[0] + 'e' + (value[1] ? (+value[1] + exp) : exp));
}
if (!Math.round10) {
  Math.round10 = (value, exp) => decimalAdjust('round', value, exp);
}

function maskValue(value) {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
}

function currencyToNum(value) {
  var cleanVal = value.replace("R$", "");
  cleanVal = cleanVal.replace(".", "");
  cleanVal = cleanVal.replace(",", ".");
  return Number(cleanVal);
}

function percentToNum(value) {
  var cleanVal = value.replace("%", "");
  cleanVal = cleanVal.replace(",", ".");
  return Number(cleanVal);
}

function maskNumber(value) {
  return new Intl.NumberFormat('pt-BR').format(value);
}

function addDecimal(value) {
  return value * 0.01;
}

/*
 * Cálculo do Simples Nacional Anexo III
 *
 * @param  {Number} O B4 (RBT12).
 * 
 * @returns {Number} 0 aliquota_efetiva.
 * @returns {Number} 1 irpj.
 * @returns {Number} 2 csll.
 * @returns {Number} 3 cofins.
 * @returns {Number} 4 pis_pasep.
 * @returns {Number} 5 cpp.
 * @returns {Number} 6 iss.
 */
function snthree(B4) {

  var B14 = 0, B15 = 0, B16 = 0, B17 = 0, B18 = 0, B19 = 0;

  /* LIM INFERIOR */
  var B7 = 0;
  var B8 = 180000.01;
  var B9 = 360000.01;
  var B10 = 720000.01;
  var B11 = 1800000.01;
  var B12 = 3800000.01;

  /* LIM SUPERIOR */
  var C7 = 180000;
  var C8 = 360000;
  var C9 = 720000;
  var C10 = 1800000;
  var C11 = 3800000;
  var C12 = 4800000;

  /* ALIQUOTA NOMINAL */
  var D7 = 0.06; // 6,00%
  var D8 = 0.1120; // 11,20%
  var D9 = 0.1350;
  var D10 = 0.16;
  var D11 = 0.21;
  var D12 = 0.33;
  var D14 = 0;

  /* VLR REDUZIDO */
  var E7 = 0;
  var E8 = 9360;
  var E9 = 17640;
  var E10 = 35640; 
  var E11 = 125640;
  var E12 = 648000;

  /* PERCENTUAIS DE REPARTICAO DE TRIBUTOS */
  /* IRPJ */
  var G7 = 0.04, G8 = 0.04, G9 = 0.04, G10 = 0.04, G11 = 0.04;
  var G12 = 0.35;
  var G15 = 0; // IRPJ
  var G17 = 0, H17 = 0, I17 = 0, J17 = 0, K17 = 0, L17 = 0;
  var G27 = 0.04, G40 = 0.04;
  var G32 = 0;
  var G35 = 0;
  var G36 = 0;

  /* CSLL */
  var H7 = 0.035, H8 = 0.035, H9 = 0.035, H10 = 0.035, H11 = 0.035;
  var H12 = 0.15;
  var H15 = 0; // CSLL
  var H27 = 0.035, H40 = 0.035;
  var H32 = 0;
  var H35 = 0;
  var H36 = 0;

  /* CONFINS */
  var I7 = 0.1282;
  var I8 = 0.1405;
  var I9 = 0.1364;
  var I10 = 0.1364;
  var I11 = 0.1282
  var I12 = 0.1603
  var I15 = 0; // Confins
  var I27 = 0.1282, I40 = 0.1282;
  var I32 = 0;
  var I35 = 0;
  var I36 = 0;

  /* PIS/PASEP */
  var J7 = 0.0278;
  var J8 = 0.0305
  var J9 = 0.0296, J10 = 0.0296;
  var J11 = 0.0278;
  var J12 = 0.0347;
  var J15 = 0; // PIS/PASEP
  var J27 = 0.0278, J40 = 0.0278;
  var J32 = 0;
  var J35 = 0;
  var J36 = 0;

  /* CPP */
  var K7 = 0.4340, K8 = 0.4340, K9 = 0.4340, K10 = 0.4340, K11 = 0.4340;
  var K12 = 0.3050;
  var K15 = 0; // CPP
  var K27 = 0.4340, K40 = 0.4340;
  var K32 = 0;
  var K35 = 0;
  var K36 = 0;

  /* ISS */
  var L7 = 0.3350;
  var L8 = 0.32;
  var L9 = 0.325, L10 = 0.325;
  var L11 = 0.335;
  var L12 = 0;
  var L15 = 0; // ISS
  var L27 = 0.6650, L40 = 0.6650;
  var L30 = 0.05;
  var L32 = 0;
  var L35 = 0;

  /*** Aliquota Efetiva ***/

  if(B4 >= B7 && B4 <= C7) {
    B14 = (B4 * D7 - E7)/B4;
  }
  if(B4 >= B8 && B4 <= C8) {
    B15 = (B4 * D8 - E8)/B4;
  }
  if(B4 >= B9 && B4 <= C9) {
    B16 = (B4 * D9 - E9)/B4;
  }
  if(B4 >= B10 && B4 <= C10) {
    B17 = (B4 * D10 - E10)/B4;
  }
  if(B4 >= B11 && B4 <= C11) {
    B18 = (B4 * D11 - E11)/B4;
  }
  if(B4 >= B12 && B4 <= C12) {
    B19 = (B4 * D12 - E12)/B4;
  }

  var C14 = Number(B14.toFixed(4));
  var C15 = Number(B15.toFixed(4));
  var C16 = Number(B16.toFixed(4));
  var C17 = Number(B17.toFixed(4));
  var C18 = Number(B18.toFixed(4));
  var C19 = Number(B19.toFixed(4));

  if(B4 >= B7 && B4 <= C7) {
    D14 = C14;
  }
  if(B4 >= B8 && B4 <= C8) {
    D14 = C15;
  }
  if(B4 >= B9 && B4 <= C9) {
    D14 = C16;
  }
  if(B4 >= B10 && B4 <= C10) {
    D14 = C17;
  }
  if(B4 >= B11 && B4 <= C11) {
    D14 = C18;
  }
  if(B4 >= B12 && B4 <= C12) {
    D14 = C19;
  }

  var D15 = Number(D14.toFixed(4));

  var C4 = D15;
  var aliquota_efetiva = (C4*100).toFixed(2);

  /*** IRPJ ***/

  if(B4 >= B7 && B4 <= C7) {
    G15 = C4 * G7;
    H15 = C4 * H7;
    I15 = C4 * I7;
    J15 = C4 * J7;
    K15 = C4 * K7;
    L15 = C4 * L7;
  }
  if(B4 >= B8 && B4 <= C8) {
    G15 = C4 * G8;
    H15 = C4 * H8;
    I15 = C4 * I8;
    J15 = C4 * J8;
    K15 = C4 * K8;
    L15 = C4 * L8;
  }
  if(B4 >= B9 && B4 <= C9) {
    G15 = C4 * G9;
    H15 = C4 * H9;
    I15 = C4 * I9;
    J15 = C4 * J9;
    K15 = C4 * K9;
    L15 = C4 * L9;
  }
  if(B4 >= B10 && B4 <= C10) {
    G15 = C4 * G10;
    H15 = C4 * H10;
    I15 = C4 * I10;
    J15 = C4 * J10;
    K15 = C4 * K10;
    L15 = C4 * L10;
  }
  if(B4 >= B11 && B4 <= C11) {
    G15 = C4 * G11;
    H15 = C4 * H11;
    I15 = C4 * I11;
    J15 = C4 * J11;
    K15 = C4 * K11;
    L15 = C4 * L11;
  }
  if(B4 >= B12 && B4 <= C12) {
    G15 = C4 * G12;
    H15 = C4 * H12;
    I15 = C4 * I12;
    J15 = C4 * J12;
    K15 = C4 * K12;
    L15 = C4 * L12;
  }

  var G16 = Number(G15.toFixed(4));
  var H16 = Number(H15.toFixed(4));
  var I16 = Number(I15.toFixed(4));
  var J16 = Number(J15.toFixed(4));
  var K16 = Number(K15.toFixed(4));
  var L16 = Number(L15.toFixed(4));

  var M16 = G16 + H16 + I16 + J16 + K16 + L16;

  var M19 = C4 - M16;

  var G16ToL16 = [ G16, H16, I16, J16, K16, L16 ];
  var maxG16ToL16 = Math.max(...G16ToL16);

  //G17 -> L17
  if(G16 == maxG16ToL16) {
    G17 = G16 + M19;
  } else {
    G17 = G16
  }
  var G18 = Number(G17.toFixed(4));

  if(H16 == maxG16ToL16) {
    H17 = H16 + M19;
  } else {
    H17 = H16
  }
  var H18 = Number(H17.toFixed(4));

  if(I16 == maxG16ToL16) {
    I17 = I16 + M19;
  } else {
    I17 = I16
  }
  var I18 = Number(I17.toFixed(4));

  if(J16 == maxG16ToL16) {
    J17 = J16 + M19;
  } else {
    J17 = J16
  }
  var J18 = Number(J17.toFixed(4));

  if(K16 == maxG16ToL16) {
    K17 = K16 + M19;
  } else {
    K17 = K16
  }
  var K18 = Number(K17.toFixed(4));

  if(L16 == maxG16ToL16) {
    L17 = L16 + M19;
  } else {
    L17 = L16
  }
  var L18 = Number(L17.toFixed(4));


  var N14 = 0.05;
  var M20 = L20 - N14;
  // N20
  if(M20 > 0) {
    N20 = M20
  } else {
    N20 = 0
  }

  var G29 = G27 / L27;
  var H29 = H27 / L27;
  var I29 = I27 / L27;
  var J29 = J27 / L27;
  var K29 = K27 / L27;
  var L29 = G29 + H29 + I29 + J29 + K29;

  var G21 = N20 * G29;
  var G22 = G18 + G21;
  var G23 = Number(G22.toFixed(4));

  var H20 = H18;
  var H21 = N20 * H29;
  var H22 = H18 + H21;
  var H23 = Number(H22.toFixed(4));

  var I20 = I18;
  var I21 = N20 * I29;
  var I22 = I18 + I21;
  var I23 = Number(I22.toFixed(4));

  var J20 = J18;
  var J21 = N20 * J29;
  var J22 = J18 + J21;
  var J23 = Number(J22.toFixed(4));

  var K20 = K18;
  var K21 = N20 * K29;
  var K22 = K18 + K21;
  var K23 = Number(K22.toFixed(4));

  var L20 = L18;
  var L21 = N20 * L29;
  var L22 = L18 + L21;
  var L23 = Number(L22.toFixed(4));

  var M22 = G22 + H22 + I22 + J22 + K22 + L22;
  var M23 = G23 + H23 + I23 + J23 + K23 + L23;

  var N23 = M22 - M23;

  var G23ToK23 = [ G23, H23, I23, J23, K23 ];
  var maxG23ToK23 = Math.max(...G23ToK23);

  var G23ToL23 = [ G23, H23, I23, J23, K23, L23 ];
  var maxG23ToL23 = Math.max(...G23ToL23);  

  // G24
  if(G23 == maxG23ToK23) {
    G24 = G23 + N23;
  } else {
    G24 = G23;
  }

  if(H23 == maxG23ToK23) {
    H24 = H23 + N23;
  } else {
    H24 = H23;
  }

  if(I23 == maxG23ToL23) {
    I24 = I23 + N23;
  } else {
    I24 = I23;
  }

  if(J23 == maxG23ToL23) {
    J24 = J23 + N23;
  } else {
    J24 = J23;
  }

  if(K23 == maxG23ToL23) {
    K24 = K23 + N23;
  } else {
    K24 = K23;
  }

  if(L23 == maxG23ToL23) {
    L24 = L23 + N23;
  } else {
    L24 = L23;
  }

  var D4 = G24;
  var irpj = (D4*100).toFixed(2);

  /*** CSLL ***/

  var E4 = H24;
  var csll = (E4*100).toFixed(2);

  /*** Cofins ***/

  var F4 = I24;
  var cofins = (F4*100).toFixed(2);

  /*** PIS/PASEP ***/

  var G4 = J24;
  var pis_pasep = (G4*100).toFixed(2);

  /*** CPP ***/

  var H4 = K24;
  var cpp = (H4*100).toFixed(2);

  /*** ISS ***/

  var I4 = L24;
  var iss = (I4*100).toFixed(2);

  return [ aliquota_efetiva, irpj, csll, cofins, pis_pasep, cpp, iss ];

}

function snfive(B4) {

  var B14 = 0, B15 = 0, B16 = 0, B17 = 0, B18 = 0, B19 = 0;

  /* LIM INFERIOR */
  var B7 = 0;
  var B8 = 180000.01;
  var B9 = 360000.01;
  var B10 = 720000.01;
  var B11 = 1800000.01;
  var B12 = 3800000.01;

  /* LIM SUPERIOR */
  var C7 = 180000;
  var C8 = 360000;
  var C9 = 720000;
  var C10 = 1800000;
  var C11 = 3800000;
  var C12 = 4800000;

  /* ALIQUOTA NOMINAL */
  var D7 = 0.1550;
  var D8 = 0.18;
  var D9 = 0.1950;
  var D10 = 0.2050;
  var D11 = 0.23;
  var D12 = 0.3050;
  var D14 = 0;

  /* VLR DEDUZIR */
  var E7 = 0;
  var E8 = 4500;
  var E9 = 9900;
  var E10 = 17100; 
  var E11 = 62100;
  var E12 = 540000;

  /* PERCENTUAIS DE REPARTICAO DE TRIBUTOS */
  /* IRPJ */
  var G7 = 0.25;
  var G8 = 0.23;
  var G9 = 0.24; 
  var G10 = 0.21;
  var G11 = 0.23;
  var G12 = 0.35;
  var G15 = 0; // IRPJ
  var G17 = 0, H17 = 0, I17 = 0, J17 = 0, K17 = 0, L17 = 0;

  /* CSLL */
  var H7 = 0.15, H8 = 0.15, H9 = 0.15, H10 = 0.15;
  var H11 = 0.1250;
  var H12 = 0.1550;

  var H15 = 0; // CSLL

  /* CONFINS */
  var I7 = 0.141;
  var I8 = 0.141;
  var I9 = 0.1492;
  var I10 = 0.1574;
  var I11 = 0.1410
  var I12 = 0.1644
  var I15 = 0; // Confins

  /* PIS/PASEP */
  var J7 = 0.0305;
  var J8 = 0.0305;
  var J9 = 0.0323;
  var J10 = 0.0341;
  var J11 = 0.0305;
  var J12 = 0.0356;
  var J15 = 0; // PIS/PASEP

  /* CPP */
  var K7 = 0.2885;
  var K8 = 0.2785;
  var K9 = 0.2385, K10 = 0.2385, K11 = 0.2385;
  var K12 = 0.2950;
  var K15 = 0; // CPP

  /* ISS */
  var L7 = 0.14;
  var L8 = 0.17;
  var L9 = 0.19;
  var L10 = 0.21;
  var L11 = 0.2350;
  var L12 = 0;
  var L15 = 0; // ISS

  /*** Aliquota Efetiva ***/

  if(B4 >= B7 && B4 <= C7) {
    B14 = (B4 * D7 - E7)/B4;
  }
  if(B4 >= B8 && B4 <= C8) {
    B15 = (B4 * D8 - E8)/B4;
  }
  if(B4 >= B9 && B4 <= C9) {
    B16 = (B4 * D9 - E9)/B4;
  }
  if(B4 >= B10 && B4 <= C10) {
    B17 = (B4 * D10 - E10)/B4;
  }
  if(B4 >= B11 && B4 <= C11) {
    B18 = (B4 * D11 - E11)/B4;
  }
  if(B4 >= B12 && B4 <= C12) {
    B19 = (B4 * D12 - E12)/B4;
  }

  var C14 = Math.round10(B14, -5)
  var C15 = Math.round10(B15, -5)
  var C16 = Math.round10(B16, -5)
  var C17 = Math.round10(B17, -5)
  var C18 = Math.round10(B18, -5)
  var C19 = Math.round10(B19, -5)

  if(B4 >= B7 && B4 <= C7) {
    D14 = C14;
  }
  if(B4 >= B8 && B4 <= C8) {
    D14 = C15;
  }
  if(B4 >= B9 && B4 <= C9) {
    D14 = C16;
  }
  if(B4 >= B10 && B4 <= C10) {
    D14 = C17;
  }
  if(B4 >= B11 && B4 <= C11) {
    D14 = C18;
  }
  if(B4 >= B12 && B4 <= C12) {
    D14 = C19;
  }

  var D15 = Number(D14.toFixed(4));

  var C4 = D15;
  var aliquota_efetiva = (C4*100).toFixed(2);

  /*** IRPJ ***/

  if(B4 >= B7 && B4 <= C7) {
    G15 = C4 * G7;
    H15 = C4 * H7;
    I15 = C4 * I7;
    J15 = C4 * J7;
    K15 = C4 * K7;
    L15 = C4 * L7;
  }
  if(B4 >= B8 && B4 <= C8) {
    G15 = C4 * G8;
    H15 = C4 * H8;
    I15 = C4 * I8;
    J15 = C4 * J8;
    K15 = C4 * K8;
    L15 = C4 * L8;
  }
  if(B4 >= B9 && B4 <= C9) {
    G15 = C4 * G9;
    H15 = C4 * H9;
    I15 = C4 * I9;
    J15 = C4 * J9;
    K15 = C4 * K9;
    L15 = C4 * L9;
  }
  if(B4 >= B10 && B4 <= C10) {
    G15 = C4 * G10;
    H15 = C4 * H10;
    I15 = C4 * I10;
    J15 = C4 * J10;
    K15 = C4 * K10;
    L15 = C4 * L10;
  }
  if(B4 >= B11 && B4 <= C11) {
    G15 = C4 * G11;
    H15 = C4 * H11;
    I15 = C4 * I11;
    J15 = C4 * J11;
    K15 = C4 * K11;
    L15 = C4 * L11;
  }
  if(B4 >= B12 && B4 <= C12) {
    G15 = C4 * G12;
    H15 = C4 * H12;
    I15 = C4 * I12;
    J15 = C4 * J12;
    K15 = C4 * K12;
    L15 = C4 * L12;
  }

  var G16 = Number(Math.round10(G15, -4).toFixed(4));
  var H16 = Number(Math.round10(H15, -4).toFixed(4));
  var I16 = Number(Math.round10(I15, -4).toFixed(4));
  var J16 = Number(Math.round10(J15, -4).toFixed(4));
  var K16 = Number(Math.round10(K15, -4).toFixed(4));
  var L16 = Number(Math.round10(L15, -4).toFixed(4));

  var M16 = G16 + H16 + I16 + J16 + K16 + L16;

  var M19 = C4 - M16;

  var G16ToL16 = [ G16, H16, I16, J16, K16, L16 ];
  var maxG16ToL16 = Math.max(...G16ToL16);

  //G17 -> L17
  if(G16 == maxG16ToL16) {
    G17 = G16 + M19;
  } else {
    G17 = G16
  }
  var G18 = Number(G17.toFixed(4));

  if(H16 == maxG16ToL16) {
    H17 = H16 + M19;
  } else {
    H17 = H16
  }
  var H18 = Number(H17.toFixed(4));

  if(I16 == maxG16ToL16) {
    I17 = I16 + M19;
  } else {
    I17 = I16
  }
  var I18 = Number(I17.toFixed(4));

  if(J16 == maxG16ToL16) {
    J17 = J16 + M19;
  } else {
    J17 = J16
  }
  var J18 = Number(J17.toFixed(4));

  if(K16 == maxG16ToL16) {
    K17 = K16 + M19;
  } else {
    K17 = K16
  }
  var K18 = Number(K17.toFixed(4));

  if(L16 == maxG16ToL16) {
    L17 = L16 + M19;
  } else {
    L17 = L16
  }
  var L18 = Number(L17.toFixed(4));

  var D4 = G18;
  var irpj = (D4*100).toFixed(2);

  /*** CSLL ***/

  var E4 = H18;
  var csll = (E4*100).toFixed(2);

  /*** Cofins ***/

  var F4 = I18;
  var cofins = (F4*100).toFixed(2);

  /*** PIS/PASEP ***/

  var G4 = J18;
  var pis_pasep = (G4*100).toFixed(2);

  /*** CPP ***/

  var H4 = K18;
  var cpp = (H4*100).toFixed(2);

  /*** ISS ***/

  var I4 = L18;
  var iss = (I4*100).toFixed(2);

  return [ aliquota_efetiva, irpj, csll, cofins, pis_pasep, cpp, iss ];

}

/*
 * Cálculo do Pró-Labore
 *
 * @param   {Number}  receita_mensal    Receita mensal.
 * @param   {Number}  aliquota_efetiva  Aliquota ISS.
 * @param   {Number}  percentagem       .
 * @param   {Number}  numDeps           Nº dependentes.
 * 
 * @returns {Number} 0 fatorR.
 * @returns {Number} 1 inssBase.
 * @returns {Number} 2 inss.
 * @returns {Number} 3 irBase.
 * @returns {Number} 4 ir (porcentagem).
 * @returns {Number} 5 valorIR.
 */
function proLaboreR(receita_mensal, aliquota_efetiva, aliquota_iss, numDeps) {

  /*** Fator R = Pro-labore ***/

  var aliqIss = 0;
  var descontoDeps = 0;
  var depValue = 189.59;

  if (aliquota_iss == undefined) {
    aliqIss = 0.28;
  } else {
    aliqIss = aliquota_iss;
  }

  if (numDeps != undefined) {
    descontoDeps = numDeps * depValue;
  }

  // salario * aliquota 
  var fatorR = receita_mensal * aliqIss;

  var calcFatorR = fatorR;

  /*** Cálculo INSS ***/

  var salarioMin = 1412;
  var inssBase = salarioMin * 0.11;
  var inss = 0;
  var limitadorInss = 825.82;

  if (calcFatorR > 7507.49 || salarioMin > 7507.49) {
    inss = limitadorInss;
  } else {
    inss = calcFatorR * 0.11;
  }

  /*** Cálculo IR ***/

  var irBase = calcFatorR - inss - descontoDeps;
  let ir = 0;
  let reduzir = null;

  // Alíquotas 2023
  var faixa1 = 2112;
  var faixa2 = 2826.65;
  var faixa3 = 3751.05;
  var faixa4 = 4664.68;

  if (irBase <= faixa1) {
    ir = 0;
    reduzir = 0;
  }
  if (irBase > faixa1 && irBase <= faixa2) {
    ir = 0.075;
    reduzir = 158.40;
  }
  if (irBase > faixa2 && irBase <= faixa3) {
    ir = 0.15;
    reduzir = 370.40;
  }
  if (irBase > faixa3 && irBase <= faixa4) {
    ir = 0.2250;
    reduzir = 651.73;
  }
  if (irBase > faixa4) {
    ir = 0.2750;
    reduzir = 884.96;
  }

  var valorIR = (irBase * ir) - reduzir;

  return [ fatorR, inssBase, inss, irBase, ir, valorIR ];
}

/*
 * Recálculo do Pró-Labore Atualizado
 *
 * @param   {Number}  proLab            Fator R / Pró-Labore.
 * @param   {Number}  numDeps           Nº dependentes.
 * 
 * @returns {Number} 2 inss.
 * @returns {Number} 3 irBase.
 * @returns {Number} 4 ir (porcentagem).
 * @returns {Number} 5 valorIR.
 */
function recalcProLab(proLab, numDeps) {

  var descontoDeps = 0;
  var depValue = 189.59; // Valor por dependente

  if (numDeps != undefined) {
    descontoDeps = numDeps * depValue;
  }

  /*** Cálculo INSS ***/

  var inssBase = proLab * 0.11;
  var inss = 0;
  var limitadorInss = 825.82;

  // Limite Pro-labore
  if (proLab <= 7507.49) {
    inss = proLab * 0.11;
  } else {
    inss = limitadorInss;
  }

  /*** Cálculo IR ***/

  var irBase = proLab - inss - descontoDeps;
  let ir = 0;
  let reduzir = null;

  // Alíquotas 2023
  var faixa1 = 2112;
  var faixa2 = 2826.65;
  var faixa3 = 3751.05;
  var faixa4 = 4664.68;

  if (irBase <= faixa1) {
    ir = 0;
    reduzir = 0;
  }
  if (irBase > faixa1 && irBase <= faixa2) {
    ir = 0.075;
    reduzir = 158.40;
  }
  if (irBase > faixa2 && irBase <= faixa3) {
    ir = 0.15;
    reduzir = 370.40;
  }
  if (irBase > faixa3 && irBase <= faixa4) {
    ir = 0.2250;
    reduzir = 651.73;
  }
  if (irBase > faixa4) {
    ir = 0.2750;
    reduzir = 884.96;
  }

  var valorIR = (irBase * ir) - reduzir;

  return [ inss, irBase, ir, valorIR ];
}

/*
 * Cálculo do Lucro Presumido
 *
 * @param  {Number}  salario  O valor do salário.
 * @param  {Number}  aliquota_iss  A alíquota escolhida.
 * 
 * @returns {Number} 0 pis.
 * @returns {Number} 1 cofins.
 * @returns {Number} 2 inss.
 * @returns {Number} 3 irpj.
 * @returns {Number} 4 csll.
 * @returns {Number} 5 irpjAdc.
 */
function lucroPresumido(salario, aliquota_iss) {

  var pisIr = 0.0065;
  var cofinsIr = 0.03;
  var pjIr = 0.048;
  var csllIr = 0.0288;

  var pis = salario * pisIr;
  var cofins = salario * cofinsIr;
  var iss = salario * aliquota_iss;
  var irpj = salario * pjIr;
  var csll = salario * csllIr;

  var salario32 = salario * 0.32;
  var irpjAdc = 0;

  if (salario32 > 20000) {
    var base = salario32 - 20000;
    irpjAdc = base * 0.1;
  }

  return [ pis, cofins, iss, irpj, csll, irpjAdc ];

}


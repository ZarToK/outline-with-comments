import GoogleSlides from "./GoogleSlides";

describe("GoogleSlides", () => {
  const match = GoogleSlides.ENABLED[0];

  test("to be enabled on share link", () => {
    expect(
      "https://docs.google.com/presentation/d/e/2PACX-1vTdddHPoZ5M_47wmSHCoigRIt2cj_Pd-kgtaNQY6H0Jzn0_CVGbxC1GcK5IoNzU615lzguexFwxasAW/pub?start=false&loop=false&delayms=3000".match(
        match
      )
    ).toBeTruthy();
    expect(
      "https://docs.google.com/presentation/d/e/2PACX-1vTdddHPoZ5M_47wmSHCoigRIt2cj_Pd-kgtaNQY6H0Jzn0_CVGbxC1GcK5IoNzU615lzguexFwxasAW/pub".match(
        match
      )
    ).toBeTruthy();
    expect(
      "https://docs.google.com/presentation/d/e/2PACX-1vTdddHPoZ5M_47wmSHCoigR/edit".match(
        match
      )
    ).toBeTruthy();
  });

  test("to not be enabled elsewhere", () => {
    expect("https://docs.google.com/presentation".match(match)).toBe(null);
    expect("https://docs.google.com".match(match)).toBe(null);
    expect("https://www.google.com".match(match)).toBe(null);
    expect(
      "https://docssgoogle.com/presentation/d/e/2PACX-1vTdddHPoZ5M_47wmSHCoigRIt2cj_Pd-kgtaNQY6H0Jzn0_CVGbxC1GcK5IoNzU615lzguexFwxasAW/pub?start=false&loop=false&delayms=3000".match(
        match
      )
    ).toBe(null);
    expect(
      "https://docs.googleecom/presentation/d/e/2PACX-1vTdddHPoZ5M_47wmSHCoigRIt2cj_Pd-kgtaNQY6H0Jzn0_CVGbxC1GcK5IoNzU615lzguexFwxasAW/pub?start=false&loop=false&delayms=3000".match(
        match
      )
    ).toBe(null);
  });
});

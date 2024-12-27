import { expect } from "../base";
import * as constants from "../../fixtures/constants";

export const fillInputField = async (inputField, value) => {
    await isVisible(inputField);
    expect(await inputField).toBeEnabled();

    await inputField.clear();
    await inputField.fill(value);

    expect(await inputField).toHaveValue(value);
};

export const clickOnElement = async (element) => {
    await isEnabled(element);
    await element.click();
};

export const verifyElementTextContent = async (element, textToMatch) => {
    await isVisible(element);
    expect(await element.textContent()).toEqual(textToMatch);
};

export const visitUrl = async (page, url) => {
    await page.goto(url);
    const ngrok = await page.locator("a").first();
    const ngrokText = await ngrok.textContent();
    if (ngrokText.trim() === constants.NGROK_LINK_TEXT) {
        await clickOnElement(page.locator("button"));
    }
    await verifyUrl(page, url);
};

export const verifyUrl = async (page, url) => {
    await page.waitForURL(url);
    const pageUrl = await page.url();
};

export const isEnabled = async (element) => {
    await isVisible(element);
    expect(await element).toBeEnabled();
};

export const isVisible = async (element) => {
    await element.waitFor();
    expect(await element).toBeVisible();
};

export const calculateDiscount = (price, discount) => {
    return Number((price * (1 - discount)).toFixed(2));
};

export const moveSlider = async (page, offset, element) => {
    const sliderClass = await element.getAttribute("class");
    let elementPosition = await element.boundingBox();
    let xCoordinate = elementPosition.x + elementPosition.width / 2;
    let yCoordinate = elementPosition.y + elementPosition.height / 2;

    await page.mouse.move(xCoordinate, yCoordinate);
    await page.mouse.down();

    if (sliderClass.includes("p-slider-handle-end")) {
        await page.mouse.move(xCoordinate - offset, yCoordinate);
        await page.mouse.up();

        return;
    }
    await page.mouse.move(xCoordinate + offset, yCoordinate);
    await page.mouse.up();
};

export const getPriceAsNumber = async (element) => {
    let price = await element.textContent();

    return Number(price.split("€")[0]);
};

export default {
    fillInputField,
    clickOnElement,
    verifyElementTextContent,
    visitUrl,
    isEnabled,
    isVisible,
    verifyUrl,
    calculateDiscount,
    moveSlider,
    getPriceAsNumber,
};

'use strict';

import { GenericEngine } from './generic-client-engine.js';

/**
 * @classdesc
 * @class
 * @augments GenericEngine
 */
export class RevealEngine extends GenericEngine {
    constructor() {
        super();
        this.callbackEngine = null;
        this.Reveal = window.Reveal;
    }

    /*
     * **************************************
     * --------EXPOSED METHODS----------------
     * **************************************
     */

    /**
     * Handle the message received from the window listener
     *
     * @param {{type: string, data: string}} message - Message to handle
     */
    forwardMessageFromRemote(message) {
        switch (message.type) {
            case 'init':
                this.Reveal.configure({
                    controls: false,
                    transition: 'default',
                    transitionSpeed: 'fast',
                    history: false,
                    slideNumber: false,
                    keyboard: false,
                    touch: false,
                    embedded: true
                });
                break;
            case 'changeSlide':
                this.goToSlide(message.data);
                break;
        }
    }

    /**
     *
     * @param {{h: number, v: number, f?: number}} indices - position of the slide to go to
     */
    goToSlide(indices) {
        this.Reveal.slide(indices.h, indices.v, indices.f || 0);
    }

    /**
     * @returns {{h: number, v: number, f: number, fMax: number}[]} List on slides
     */
    getSlides() {
        const slides = [];
        const horizontalSlides = document.querySelectorAll('.slides>section');
        horizontalSlides.forEach((slideH, indexH) => {
            const fragmentsH = slideH.querySelectorAll('.fragment');
            const verticalSlides = slideH.querySelectorAll('section');
            if (verticalSlides.length) {
                verticalSlides.forEach((slideV, indexV) => {
                    const fragmentsV = slideV.querySelectorAll('.fragment');
                    slides.push({ h: indexH, v: indexV, f: 0, fMax: fragmentsV.length ? fragmentsV.length + 1 : 0 });
                });
            } else {
                slides.push({ h: indexH, v: 0, f: 0, fMax: fragmentsH.length ? fragmentsH.length + 1 : 0 });
            }
        });
        return slides;
    }
}
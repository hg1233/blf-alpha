<script>
import { storageAvailable } from '../../helpers/storage';
import { trackEvent } from '../../helpers/metrics';

const canStore = storageAvailable('localStorage');
const STORAGE_KEY = 'biglotteryfund:cookie-consent';

export default {
    props: ['title', 'message', 'action'],
    data() {
        const hasAccepted = canStore && window.localStorage.getItem(STORAGE_KEY) === 'true';
        return { isShown: hasAccepted === false };
    },
    methods: {
        handleAccept() {
            canStore && window.localStorage.setItem(STORAGE_KEY, 'true');
            trackEvent('Cookie Warning', 'Click', 'Accept');
            this.isShown = false;
        }
    }
};
</script>

<template>
    <aside class="cookie-consent u-dont-print" :class="{ 'is-shown': isShown }">
        <div class="cookie-consent__inner">
            <div class="cookie-consent__content" v-html="message"></div>
            <div class="cookie-consent__actions">
                <button class="btn btn--small" @click="handleAccept">{{ action }}</button>
            </div>
        </div>
    </aside>
</template>

<script>
export default {
    props: {
        // fieldName: { type: String, required: true },
        // maxBudget: { type: Number, required: true },
        // maxItems: { type: Number, required: true },
        // budgetData: { type: Array, required: false }
    },
    mounted() {
        // if (!this.budgetData) {
        //     this.addItem();
        // } else {
        //     this.budgetRows = this.budgetData;
        // }
    },
    data() {
        return {
            // budgetRows: [],
            // error: {}
        };
    },
    computed: {
        // total() {
        //     return this.budgetRows.reduce((acc, cur) => {
        //         return acc + parseInt(cur.cost || 0);
        //     }, 0);
        // }
    },
    watch: {
        // budgetRows: {
        //     handler() {
        //         if (this.shouldCreateNewRow()) {
        //             this.addItem();
        //         }
        //         this.error.TOO_MANY_ITEMS = this.budgetRows.length === this.maxItems;
        //         this.error.OVER_BUDGET = this.maxBudget && this.total > this.maxBudget;
        //     },
        //     deep: true
        // }
    },
    methods: {
        // addItem: function(item = { item: '', cost: '', isNew: true }) {
        //     this.budgetRows.push(item);
        // },
        // removeItem: function(item) {
        //     this.budgetRows = this.budgetRows.filter(i => i !== item);
        // },
        // shouldCreateNewRow: function() {
        //     const lastItem = this.budgetRows[this.budgetRows.length - 1];
        //     return (
        //         lastItem &&
        //         this.budgetRows.length < this.maxItems &&
        //         (!isEmpty(lastItem.item) || !isEmpty(lastItem.cost))
        //     );
        // },
        // getLineItemName: function(index, subFieldName) {
        //     return `${this.fieldName}[${index}][${subFieldName}]`;
        // }
    }
};
</script>

<template>
    <div class="ff-address-lookup">
        hello world
    </div>
</template>

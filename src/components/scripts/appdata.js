import {v4 as uuidv4} from 'uuid';
import {computed, reactive, ref} from "vue";

export const ELEMENT_TYPE = {
    FEATURE: "Feature",
    CATEGORY: "Category",
}

export class Category {
    constructor(title, id) {
        this.type = ELEMENT_TYPE.CATEGORY
        this.id = id ?? uuidv4()
        this.title = title ?? ""
        /**
         * @deprecated since version 2.0
         */
    }
}

export class Feature {
    constructor(title, description, categoryId, id) {
        this.type = ELEMENT_TYPE.FEATURE
        this.id = id ?? uuidv4()
        this.title = title ?? ""
        this.description = description ?? ''
        this.categoryId = categoryId ?? -1
    }
}

export function GeneralCollection() {
    this._arr = reactive([]);

    this.add = function (item) {
        this._arr.push(item);

        return this;
    }
    this.remove = function (item) {
        this._arr.splice(this._arr.indexOf(item), 1);

        return this;
    }
    this.findItemById = function (id) {
        return this._arr.find(item => item.id === id)
    }

    this.indexOf = function (item){
        return this._arr.indexOf(item)
    }

    /**
     * @deprecated since version 2.0
     */
    this.swapPositions = function (itemA, itemB) {
        this.swapItemsByIndex(this._arr.indexOf(itemA),this._arr.indexOf(itemB))

        return this;
    }

    //Position shifts
    this.swapItemsByIndex = function (indexA, indexB){
        this._arr.splice(indexA, 1, this._arr.splice(indexB, 1, this._arr[indexA])[0])

        return this
    }
    this.swapItems = function (itemA, itemB){
        let indexA = this.indexOf(itemA)
        let indexB = this.indexOf(itemB)
        return this.swapItemsByIndex(indexA, indexB)
    }

    this.moveItem = function (itemIndex, targetIndex){
        this._arr.splice(targetIndex, 0, ...this._arr.splice(itemIndex, 1))

        return this
    }

    this.sendToEnd = function (currentIndex) {
        this._arr.push(this._arr.splice(currentIndex, 1)[0])

        return this;
    }

    /**
     * @deprecated since version 2.0
     */

    this.items = function () {
        return [...this._arr]
    }
}

export function CategoryCollection() {
    GeneralCollection.call(this)

    this.create = function (title, id) {
        this.add(new Category(title, id))

        return this
    }

    this.save = function (category, changedCategory) {
        category.title = changedCategory.title

        return this
    }
}

export function FeatureCollection() {
    GeneralCollection.call(this)

    this.create = function (title, description, categoryId, id) {
        this.add(new Feature(title, description, categoryId, id))

        return this;
    }

    this.save = function (feature, changedFeature) {
        feature.title = changedFeature.title
        feature.description = changedFeature.description
        if (feature.categoryId !== changedFeature.categoryId) {
            feature.categoryId = changedFeature.categoryId
            this.sendToEnd(feature.id)
        }

        return this;
    }

    this.itemsByCategory = function (categoryId) {
        return this.items().filter(feature => feature.categoryId === categoryId)
    }
}

export function FeatureDataController() {
    this.defaultCategory = () => new Category('', -1)

    this.categories = new CategoryCollection()
    this.features = new FeatureCollection()

    this.features['itemsWithoutCategory'] = () => {
        return this.features.items()
            .filter(//for each feature
                feature => //does it have a category?
                    !this.categories.items()
                        .some(category => {
                            return feature.categoryId === category?.id
                        }))
    }

    this.categories['usedCategories'] = () => this.categories.items()
        .filter(category => this.features.items().some(feature => feature.categoryId === category.id))

    const oldCatRemove = this.categories.remove
    this.categories.remove = (item) => {
        oldCatRemove.apply(this.categories, arguments)
        this.features.itemsWithoutCategory().forEach(feature => feature.categoryId = -1);


    }
}

export const PageInfo = function (dataController) {
    //Pages
    this.pages = computed(() => dataController.categories.usedCategories())
    this.pageCount = computed(() => this.pages.value.length)

    //Current Page
    this.index = ref(0)
    this.currentCategory = computed(() => this.indexToCategory(this.index.value))
    this.currentPageContents = computed(() => this.pageContents(this.index.value))
    this.isLastPage = computed(() => this.index.value === (this.pageCount.value - 1))

    //Change Page
    this.changePage = function (page) {
        this.index.value = page
    }
    this.changePageById = function (id) {
        let category = this.pages.value.find(category => category.id === id)
        this.index.value = this.pages.value.indexOf(category)
    }

    //Main methods
    this.indexToCategory = function (i) {
        return i > -1 ? this.pages.value[i] : dataController.defaultCategory
    }
    this.pageContents = (index) => {
        return index !== -1 ? dataController.features.itemsByCategory(this.indexToCategory(index).id) : dataController.features.itemsWithoutCategory()
    }

    //clamp
    this.clampToPage = (value) => {
        return Math.min(Math.max(value, -1), this.pageCount.value - 1)
    }

}


export function importData(){
    const dataController = new FeatureDataController()
    dataController.features
        .create(
            'New Challenge to Minecraft!',
            "You are now a guardian spirit here to watch over a spirit tree! It is your job to care" +
            " for and grow the spirit tree to becomes a monument amongst trees! \n" +
            "\n" +
            "This mod turns every player into a dryad who, after choosing a tree to protect, binds them to " +
            "the tree. Wandering too far away will deplete a player's air while being close to the tree will " +
            "fill it back up.",
            0,
            0,
        )
        .create(
            'Choosing the tree',
            "When a player joins, they will start in ghost form. In order to get out of ghost form," +
            "a player must chose a tree by punching it and accepting the chat prompt. " +
            "\n\n" +
            "Once chosen, a player is then given a few saplings to start and must then grow the tree by hand.",
            0,
            1,
        )
        .create(
            'Growing Stick',
            "To grow the tree, the player must add only logs that are descended from the original" +
            "tree. Saplings from the player's spirit tree will glow and be specially named. When planted, " +
            "these trees will produce logs that glow when picked up by the guardian player. " +
            "\n\n" +
            "Using logs or saplings from other trees will not grow your spirit tree, though they can be used " +
            "as decoration. Placed logs that are part of the spirit tree will pulse when holding a Log or " +
            "sappling from the tree.",
            2,
            2,
        )
        .create(
            'Home upgrade: Reach',
            "This upgrade allows a player to go farther from the tree by two blocks per level." +
            "\n\n" +
            "Requirements: A tree must have at least 200 blocks for this upgrade to unlock. It costs one enderpearl," +
            "one magmablock, and 10 experience levels per upgrade with a max of 3 upgrades",
            1,
            3,
        )

    dataController.categories
        .create(
            'Core Gameplay',
            0,
        )
        .create(
            'Upgrades',
            1,
            1,
        )
    return dataController
}
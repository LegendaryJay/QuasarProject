import {v4 as uuidv4} from 'uuid';
import {reactive} from "vue";

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
        this.swapItems(this._arr.indexOf(itemA),this._arr.indexOf(itemB))

        return this;
    }

    //Position shifts
    this.swapItems = function (indexA, indexB){
        this._arr.splice(indexA, 1, this._arr.splice(indexB, 1, this._arr[indexA])[0])

        return this

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
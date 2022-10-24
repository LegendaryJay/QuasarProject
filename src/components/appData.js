import {v4 as uuidv4} from 'uuid';
import {reactive} from "vue";


export function Category(title, id, position) {
    return {
        type: "Category", id: id ?? uuidv4(), title: title ?? "", position: position ?? Number.MAX_SAFE_INTEGER,
    }
}

export class Feature {
    constructor(title, description, categoryId, id, position) {
        this.type = "Feature"
        this.id = id ?? uuidv4()
        this.title = title ?? ""
        this.position = position ?? Number.MAX_SAFE_INTEGER
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

    this.swapPositions = function (itemA, itemB) {
        let tempA = itemA.position
        itemA.position = itemB.position
        itemB.position = tempA

        return this;
    }

    const sortByPosition = function (a, b) {
        return a.position - b.position
    }

    this.items = function () {
        return [...this._arr.sort(sortByPosition)]
    }
}

export function FeatureDataController() {
    const defaultCategory = new Category('', -1)
    const _featureCollection = new GeneralCollection()
    const _categoryCollection = new GeneralCollection()

    this.getDefaultCategory = function () {
        return {...defaultCategory}
    }
    //THIS GLOBAL
    const setPositions = function (arr) {
        for (let i = 0; i < arr.length; i++) {
            arr[i].position = i
        }
    }

    const getFeatureCategory = (feature) => {
        return this.categories.findById(feature.categoryId)
    }

    this.categories = {
        _arr: _categoryCollection, //CATEGORIES - private
        refreshPositions: function () {
            setPositions(this._arr.items())
        },

        //CATEGORIES - public
        add: function (category) {
            this._arr.add(category);
            this.refreshPositions()

            return this;
        },

        save: function (category, changedCategory) {
            category.title = changedCategory.title
        },

        remove: function (category) {
            _featureCollection.items().filter(feature => feature.categoryId === category.id).forEach(feature => feature.categoryId = -1)
            this._arr.remove(category);
            this.refreshPositions()

            return this;
        },

        findById: function (id) {
            return this._arr.findItemById(id);
        },


        swapPositions: function (featureA, featureB) {
            this._arr.swapPositions(featureA, featureB)
        },


        items: function () {
            return this._arr.items()
        },

        usedCategories: function () {
            return this._arr.items().filter(category => _featureCollection.items().some(feature => feature.categoryId === category.id))
        },
    }


    this.features = {
        _arr: _featureCollection, //FEATURES - public

        itemsByCategory: function (categoryId) {
            return this._arr.items().filter(feature => feature.categoryId === categoryId)
        },

        refreshPositions: function (categoryId) {
            setPositions(this.itemsByCategory(categoryId))
        },


        add: function (feature) {
            Object.defineProperty(feature, 'category', {
                get: function () {
                    return getFeatureCategory(this.categoryId) ?? defaultCategory
                }
            })

            this._arr.add(feature);
            this.refreshPositions(feature.categoryId)

            return this;
        },

        save: function (feature, changedFeature) {
            feature.title = changedFeature.title
            feature.description = changedFeature.description
            if (feature.categoryId !== changedFeature.categoryId) {
                feature.position = Number.MAX_SAFE_INTEGER
                this.refreshPositions(feature.categoryId)
                this.refreshPositions(changedFeature.categoryId)
            }
        },

        remove: function (feature) {
            this._arr.remove(feature);
            this.refreshPositions(feature.category)

            return this;
        },

        findById: function (id) {
            return this._arr.findItemById(id);
        },

        swapPositions: function (featureA, featureB) {
            this._arr.swapPositions(featureA, featureB)
        },

        items: function () {
            return this._arr.items()
        },

        itemsWithoutCategory: function () {
            return this._arr.items()
                .filter(//for each feature
                    feature => //does it have a category?
                        !_categoryCollection.items()
                            .some(category => {
                                return feature.categoryId === category?.id
                            }))
        }


    }
}
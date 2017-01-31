import React from 'react';
import clone from 'clone';
import ChildrenProxyComponent from './children-proxy-component';

/**
 * @typedef {Object} SlotOption
 * @property {String} name
 */

 /**
  * @typedef {Object} Slot
  * @property {String} name
  * @property {ChildrenProxyComponent} childrenProxy
  * @property {Array.<Node>} children
  */

/**
 * @param {Node} node
 * @returns {Boolean}
 */
function isElementNode(node) {
    return node.nodeType === 1;
}

/**
 * @param {Node} node
 * @returns {Boolean}
 */
function isEmptyTextNode(node) {
    return node.nodeType === 3 && node.textContent.trim().length === 0;
}

/**
 * @param {Node} node
 */
function cleanNode(node) {
    while (node.childNodes.length > 0) {
        node.removeChild(node.firstChild);
    }
}

/**
 * @param {HTMLElement} slotNode
 * @param {Slot} slot
 */
function fillSlotNodes(slotNode, slot) {
    let nodes = slotNode.childNodes;
    for (let i = 0; i < nodes.length; i += 1) {
        let node = nodes[i];

        // Skip empty nodes for not filled slots
        if (!isEmptyTextNode(node) || slot.nodes.length > 0) {
            slot.nodes.push(node);
        }
    }
}

const SlotsMixin = {
    /**
     * @param {Object.<SlotOption>} slots
     */
    _initializeSlots(slots) {
        this._slots = {
            ...clone(slots),
            ...{ children: { name: 'children' } }
        };
        this._slotsNames = Object.keys(this._slots);
        this._slotsNames.forEach((slotName) => { this._slots[slotName].nodes = []; });
        this._slotsValid = false;
    },

    _resetSlots() {
        this._slotNames.forEach((slotName) => { this._slots[slotName].nodes.length = 0; });
        this._slotsValid = false;
    },

    _renderSlots() {
        if (this._slotsValid) {
            return;
        }

        let slots = this._slots;
        this._slotsNames.forEach((slotName) => {
            let slot = slots[slotName];
            if (slot.nodes.length === 0) {
                return;
            }

            if (slot.element) {
                cleanNode(slot.element);
                slot.nodes.forEach(node => slot.element.appendChild(node));
            }
        });

        this._slotsValid = true;
    },

    /**
     * @param {HTMLElement} reactComponentRootElement
     * @returns {Object}
     */
    _getSlotsProps(reactComponentRootElement) {
        let props = {};

        let slots = this._slots;
        let childrenSlot = slots.children;
        let nodes = this.childNodes;

        for (let i = 0; i < nodes.length; i += 1) {
            let node = nodes[i];
            let attrSlot = isElementNode(node) && node.getAttribute('slot');

            // Process slot as attr: `<div slot="slot-name"> ... </div>`
            if (attrSlot) {
                let slot = slots[attrSlot];
                if (slot) {
                    slot.nodes.push(node);
                }

            // Process slot as tag: `<slot name="slot-name"> ... </slot>`
            } else if (node.tagName === 'SLOT') {
                let slot = slots[node.getAttribute('name')];
                if (slot) {
                    fillSlotNodes(node, slot);
                }

            // Process any other node...
            } else if (node !== reactComponentRootElement) {
                // Skip empty nodes for not filled children slot
                if (!isEmptyTextNode(node) || childrenSlot.nodes.length > 0) {
                    childrenSlot.nodes.push(node);
                }
            }
        }

        this._slotsNames.forEach((slotName) => {
            let slot = slots[slotName];

            // Strip trailing white space
            if (slot.nodes.length > 0) {
                while (isEmptyTextNode(slot.nodes[slot.nodes.length - 1])) {
                    slot.nodes.pop();
                }
            }

            if (slot.nodes.length === 0) {
                return;
            }

            if (!slot.childrenProxy) {
                slot.childrenProxy = (
                    <ChildrenProxyComponent
                        refCallback={(element) => { slot.element = element; }}
                    />
                );
            }

            props[slot.name] = slot.childrenProxy;
        });

        return props;
    }
};

export default SlotsMixin;

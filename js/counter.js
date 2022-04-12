/*
 * Mechanical Counter
 *
 * 2022 (C) Alexander Avtanski <alex@avtanski.com>
 * This work is licensed under a Creative Commons Attribution 4.0 International License
 */

"use strict";

const U = {
    a: function(parent, tag, attr, text) {
        let e = document.createElement(tag)
        if (parent) parent.appendChild(e);
        if (attr) for (let a in attr) e.setAttribute(a, attr[a]);
        if (text) e.appendChild(document.createTextNode(text));
        return e;
    },

    c: function(element) {
        while (element && element.firstChild) {
            element.removeChild(element.firstChild);
        }
    }
}

const MechanicalCounter = function(parent, digitsBeforeDecimal, digitsAfterDecimal,
                                   size, decimalPointCharacter, wonkiness) {

    const sizes = [
        {
            aperture_border: '8px',
            aperture_border_radius: '15px',
            aperture_padding: '0px 10px',
            aperture_gap: '5px',
            font_size: '40px',
            roller_height: '70px',
            roller_width: '40px',
            decimal_point_padding: '20px 0px',
            digit_height: '60px',
            digit_height_px: 60
        },
        {
            aperture_border: '8px',
            aperture_border_radius: '15px',
            aperture_padding: '0px 10px',
            aperture_gap: '5px',
            font_size: '30px',
            roller_height: '50px',
            roller_width: '30px',
            decimal_point_padding: '15px 0px',
            digit_height: '40px',
            digit_height_px: 40
        },
         {
            aperture_border: '8px',
            aperture_border_radius: '15px',
            aperture_padding: '0px 8px',
            aperture_gap: '5px',
            font_size: '20px',
            roller_height: '35px',
            roller_width: '20px',
            decimal_point_padding: '10px 0px',
            digit_height: '30px',
            digit_height_px: 30
        }
    ]

    this.size = Math.min(Math.max(Math.floor(size || 0),0), sizes.length)
    this.wonkiness = wonkiness || 0.1
    this.s = sizes[this.size]
    this.parent = parent
    this.nBD = digitsBeforeDecimal || 4
    this.nAD = digitsAfterDecimal || 0
    this.dpChar = decimalPointCharacter || ','
    this.value = 0

    this.aperture = null
    this.dBD = []
    this.dAD = []

    this.setValue = function(value, jump) {
        let backwards = Math.abs(value) < Math.abs(this.value)
        this.value = value
        let ba = value.toFixed(this.nAD).split('.')
        let changes = this.setRollerSegment(this.dBD, ba[0], jump, backwards)
        if (ba.length > 1) changes = changes.concat(this.setRollerSegment(this.dAD, ba[1], jump, backwards))
        if (!jump) {
            let flaps = 0
            let rolls = 0
            let max_roll_distance = 0
            for (let i=0; i<changes.length; i++) {
                let c = changes[i]
                if (c.flap) flaps += c.flap
                if (c.roll) rolls += c.roll
                if (c.roll_distance) max_roll_distance = Math.max(c.roll_distance, max_roll_distance)
            }
        }
    }

    this.init = function() {
        U.c(this.parent)
        let wrapper = U.a(this.parent, 'div', {class: 'counter_wrapper'})
        this.aperture = U.a(wrapper, 'div', {class: 'counter_aperture'})
        this.aperture.style['border'] = this.s.aperture_border + ' solid #666'
        this.aperture.style['border-radius'] = this.s.aperture_border_radius
        this.aperture.style['padding'] = this.s.aperture_padding
        this.aperture.style['gap'] = this.s.aperture_gap
        for (let i=0; i<this.nBD; i++) {
            this.dBD.push(new Roller(this.aperture, this.s, this.wonkiness))
        }
        if (this.nAD) {
            let dp = U.a(this.aperture, 'div', {class: 'counter_decimal_point'}, this.dpChar)
            dp.style['font-size'] = this.s.font_size
            dp.style['padding'] = this.s.decimal_point_padding
            dp.style['height'] = this.s.roller_height
            for (let i=0; i<this.nAD; i++) this.dAD.push(new Roller(this.aperture, this.s, this.wonkiness))
        }
        this.setValue(0, true)
    }

    this.setRollerSegment = function(rollers, s, jump, backwards) {
        let changes = []
        if (s.length < rollers.length) {
            s = ' '.repeat(rollers.length - s.length) + s
        }
        for (let i = rollers.length - 1; i >= 0; i--) {
            changes.push(rollers[i].go(s.charAt(i), jump, backwards))
        }
        return changes
    }

    const Roller = function(div, s, wonkiness) {

        this.C = '01234567890'
        this.div = div
        this.s = s
        this.wonkiness = wonkiness
        this.digitsDiv = null
        this.position = null
        this.wonkyPosition = null
        this.jumpPositions = []
        this.moveCL = null

        this.init = function() {
            this.moveCL = this.move.bind(this)
            let rDiv = U.a(this.div, 'div', {class: 'counter_roller'})
            rDiv.style['height'] = this.s.roller_height
            rDiv.style['width'] = this.s.roller_width
            rDiv.style['min-width'] = this.s.roller_width
            this.digitsDiv = U.a(rDiv, 'div', {class: 'counter_digits'})
            this.digitsDiv.style['font-size'] = this.s.font_size
            this.go(' ', -1)
            for (let c of this.C) {
                let d = U.a(this.digitsDiv, 'div', {class: 'counter_d'}, c)
                d.style['height'] = this.s.digit_height
            }
        }

        this.go = function(pos, jump, backwards, speed) {
            speed = speed || 0.13
            let oldPosition = this.position
            let changes = {flap: 0, roll: 0, roll_distance: 0}
            if (('' + pos).trim().length != 1) {
                this.position = -1
            } else {
                this.position = parseInt(pos)
            }
            if (oldPosition == this.position) return changes
            let oldWonkyPosition = this.wonkyPosition
            this.wonkyPosition = this.position + Math.random() * 2 * this.wonkiness - this.wonkiness
            if (this.position == -1) {
                this.digitsDiv.style.visibility = 'hidden'
                changes.flap = 1
                return changes
            }
            if (oldPosition == -1) changes.flap = 1
            this.digitsDiv.style.visibility = 'visible'
            if (jump) {
                this.jumpPositions.push(this.wonkyPosition)
            } else {
                let p = oldWonkyPosition
                do {
                    p += backwards ? -speed : speed
                    if (p < 0) p += 10
                    p = p % 10
                    this.jumpPositions.push(p)
                } while (Math.abs(p - this.wonkyPosition) > 2 * speed)
                this.jumpPositions.push(this.wonkyPosition)
            }
            this.move()
            changes.roll_distance = 1  // TODO
            changes.roll = 1
            return changes
        }

        this.move = function() {
            if (!this.jumpPositions.length) return
            let p = this.jumpPositions.shift()
            this.digitsDiv.style.transform =
                'translateY(' + (5 * this.s.digit_height_px - p * this.s.digit_height_px) + 'px)'
            if (this.jumpPositions.length) setTimeout(this.moveCL, 10)
        }

        this.init()
    }

    this.init()
}


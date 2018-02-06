import { Vector2 } from '../lib/threejs/math/Vector2';
import { CHEERIO_Z } from '../constants/Constants';

import GameObject from './GameObject';
import Cheerio from './Cheerio';

/* TODO: get rid of leading points, just use cheerios array */

class Track extends GameObject {
    
    constructor(x, y, z) {
        
        super(x, y, z);
        
        this.type = 'Track';
        
        // Since the Cheerio's Z coordinate is constant, we will work with only Vector2(x, y) to simplify.
        this.innerLeadingPoints = [ new Vector2(-320, -170) ];
        this.outerLeadingPoints = [ new Vector2(-470, -170) ];
        
        this.cheerios = Array();
        
        this.createLine(9, 'vertical');
        
        this.createInnerCurve(8, new Vector2(-150, 150));
        this.createOuterCurve(15, new Vector2(-150, 150));
        
        this.createLine(9, 'horizontal');
        
        this.createInnerCurve(9, new Vector2(180, 220));
        this.createOuterCurve(22, new Vector2(180, 220));
        
        this.createLine(6, 'bhorizontal');
        
        this.createOuterCurve(4, new Vector2(-17, -70), 1);
        this.createInnerCurve(17, new Vector2(-17, -70), 1);
        
        this.createLine(8, 'horizontal');
        
        this.createInnerCurve(4, new Vector2(253, -300));
        this.createOuterCurve(18, new Vector2(254, -300));
        
        this.createLine(10, 'bhorizontal');
        
        this.createInnerCurve(7, new Vector2(-120, -125));
        this.createOuterCurve(15, new Vector2(-178, -200));

        this.innerLeadingPoints.forEach( (point) => {
            this.cheerios.push(new Cheerio(point.x, point.y, CHEERIO_Z));
        });
        
        this.outerLeadingPoints.forEach( (point) => {
            this.cheerios.push(new Cheerio(point.x, point.y, CHEERIO_Z));
        });
        
        this.cheerios.forEach( (cheerio) => this.add(cheerio) );
        
        // Free up memory
        this.cheerios = undefined;
        this.innerLeadingPoints = undefined;
        this.outerLeadingPoints = undefined;
        
    }
    
    createVerticalLine(numberPoints) {
        this.createLine(numberPoints, 'vertical');
    }
    
    createHorizontalLine(numberPoints) {
        this.createLine(numberPoints, 'horizontal');
    }
    
    createLine (numberPoints, type) {
        let innerPoint = this.innerLeadingPoints.slice(-1)[0];
        let outerPoint = this.outerLeadingPoints.slice(-1)[0];
        let spacing = 40;
        let newInnerPoints, newOuterPoints;
        if (type == 'vertical') {
            newInnerPoints = Array.from(new Array(numberPoints), (x,i) => new Vector2(innerPoint.x, innerPoint.y + i * spacing));
            newOuterPoints = Array.from(new Array(numberPoints), (x,i) => new Vector2(outerPoint.x, outerPoint.y + i * spacing));
        }
        else if (type == 'horizontal') {
            newInnerPoints = Array.from(new Array(numberPoints), (x,i) => new Vector2(innerPoint.x + i * spacing, innerPoint.y));
            newOuterPoints = Array.from(new Array(numberPoints), (x,i) => new Vector2(outerPoint.x + i * spacing, outerPoint.y));
        }
        else if (type == 'bhorizontal') {
            newInnerPoints = Array.from(new Array(numberPoints), (x,i) => new Vector2(innerPoint.x - i * spacing, innerPoint.y));
            newOuterPoints = Array.from(new Array(numberPoints), (x,i) => new Vector2(outerPoint.x - i * spacing, outerPoint.y));
        }
        else if (type == 'bvertical') {
            newInnerPoints = Array.from(new Array(numberPoints), (x,i) => new Vector2(innerPoint.x, innerPoint.y - i * spacing));
            newOuterPoints = Array.from(new Array(numberPoints), (x,i) => new Vector2(outerPoint.x, outerPoint.y - i * spacing));
        }
        this.innerLeadingPoints.push(...newInnerPoints);
        this.outerLeadingPoints.push(...newOuterPoints);
    }
    
    createInnerCurve (numberPoints, center, direction = -1) {
        
        let innerPoint = this.innerLeadingPoints.slice(-1)[0];
        let innerDivision = innerPoint.distanceTo(center) / 11;
        
        for (var i = 0; i < numberPoints; i++) {
            
            let prevInnerPoint = this.innerLeadingPoints.slice(-1)[0].clone();
            let innerAngle = direction * Math.PI / innerDivision;
            
            prevInnerPoint.rotateAround(center, innerAngle);
            this.innerLeadingPoints.push(new Vector2(prevInnerPoint.x, prevInnerPoint.y));
        }
    }
    
    createOuterCurve (numberPoints, center, direction = -1) {
        let outerPoint = this.outerLeadingPoints.slice(-1)[0];
        let division = outerPoint.distanceTo(center) / 11;
        
        for (var i = 0; i < numberPoints; i++) {
            
            let prevOuterPoint = this.outerLeadingPoints.slice(-1)[0].clone();
            let angle = direction * Math.PI / division;
            
            prevOuterPoint.rotateAround(center, angle);
            this.outerLeadingPoints.push(new Vector2(prevOuterPoint.x, prevOuterPoint.y));
        }
    }
}

export default Track;
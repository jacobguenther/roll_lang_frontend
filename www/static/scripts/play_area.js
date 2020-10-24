"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var Layer = (function () {
    function Layer(height, sublayers) {
        this.height_m = 0;
        this.sublayers = [];
        this.height = height;
        if (sublayers) {
            for (var _i = 0, sublayers_1 = sublayers; _i < sublayers_1.length; _i++) {
                var sublayer = sublayers_1[_i];
                this.addSublayer(sublayer);
            }
        }
    }
    Layer.default = function () {
        var height = 0;
        var sublayers = [];
        sublayers.push(new Sublayer(0));
        sublayers.push(new Sublayer(1));
        sublayers.push(new Sublayer(2));
        return new Layer(height, sublayers);
    };
    Object.defineProperty(Layer.prototype, "height", {
        get: function () {
            return this.height_m;
        },
        set: function (h) {
            this.height_m = Math.max(0, h);
        },
        enumerable: true,
        configurable: true
    });
    Layer.prototype.addSublayer = function (sublayer) {
        if (sublayer instanceof Sublayer) {
            this.sublayers.push(sublayer);
        }
    };
    return Layer;
}());
var SublayerType;
(function (SublayerType) {
    SublayerType[SublayerType["GRID"] = 0] = "GRID";
    SublayerType[SublayerType["FREEHAND"] = 1] = "FREEHAND";
    SublayerType[SublayerType["VECTOR"] = 2] = "VECTOR";
    SublayerType[SublayerType["WALLS"] = 3] = "WALLS";
    SublayerType[SublayerType["IMAGE"] = 4] = "IMAGE";
    SublayerType[SublayerType["MASK"] = 5] = "MASK";
    SublayerType[SublayerType["LIGHTS"] = 6] = "LIGHTS";
})(SublayerType || (SublayerType = {}));
;
var Sublayer = (function () {
    function Sublayer(type) {
        this.type = type;
    }
    return Sublayer;
}());
var ZoomConstraints = (function () {
    function ZoomConstraints() {
    }
    ZoomConstraints.clamp = function (z) {
        return clamp(z, ZoomConstraints.min, ZoomConstraints.max);
    };
    ZoomConstraints.default = 100;
    ZoomConstraints.min = 25;
    ZoomConstraints.max = 200;
    return ZoomConstraints;
}());
var Camera2D = (function () {
    function Camera2D() {
        this.zoom = ZoomConstraints.default;
    }
    Camera2D.prototype.reset = function () {
    };
    Object.defineProperty(Camera2D.prototype, "zoom", {
        get: function () {
            return this.zoom_m;
        },
        set: function (z) {
            this.zoom_m = ZoomConstraints.clamp(z);
        },
        enumerable: true,
        configurable: true
    });
    return Camera2D;
}());
var Camera3D = (function () {
    function Camera3D() {
    }
    return Camera3D;
}());
var KeyedCollection = (function () {
    function KeyedCollection() {
        this.items = {};
        this.count_m = 0;
    }
    KeyedCollection.prototype.add = function (key, value) {
        if (!this.items.hasOwnProperty(key))
            this.count_m++;
        this.items[key] = value;
    };
    KeyedCollection.prototype.containsKey = function (key) {
        return this.items.hasOwnProperty(key);
    };
    KeyedCollection.prototype.count = function () {
        return this.count_m;
    };
    KeyedCollection.prototype.item = function (key) {
        return this.items[key];
    };
    KeyedCollection.prototype.keys = function () {
        var keySet = [];
        for (var prop in this.items) {
            if (this.items.hasOwnProperty(prop)) {
                keySet.push(prop);
            }
        }
        return keySet;
    };
    KeyedCollection.prototype.remove = function (key) {
        var val = this.items[key];
        delete this.items[key];
        this.count_m--;
        return val;
    };
    KeyedCollection.prototype.values = function () {
        var values = [];
        for (var prop in this.items) {
            if (this.items.hasOwnProperty(prop)) {
                values.push(this.items[prop]);
            }
        }
        return values;
    };
    return KeyedCollection;
}());
var SourceResource = (function () {
    function SourceResource(source) {
        this.source = source;
    }
    return SourceResource;
}());
var ShaderResource = (function () {
    function ShaderResource(sourceName, type, shader) {
        this.sourceName = sourceName;
        this.type = type;
        this.shader = shader;
    }
    return ShaderResource;
}());
var ShaderAttributeLocations = (function () {
    function ShaderAttributeLocations(gl, shaderProgram) {
        this.vertexPosition = gl.getAttribLocation(shaderProgram, 'aVertexPosition');
    }
    return ShaderAttributeLocations;
}());
var ShaderUniformLocations = (function () {
    function ShaderUniformLocations(gl, shaderProgram) {
        this.projectionMatrix = gl.getUniformLocation(shaderProgram, 'uProjectionMatrix');
        this.modelViewMatrix = gl.getUniformLocation(shaderProgram, 'uModelViewMatrix');
    }
    return ShaderUniformLocations;
}());
var ProgramResource = (function () {
    function ProgramResource(gl, vertexSourceName, fragmentSourceName, program) {
        this.vertexSourceName = vertexSourceName;
        this.fragmentSourceName = fragmentSourceName;
        this.program = program;
        this.attributeLocations = new ShaderAttributeLocations(gl, program);
        this.uniformLocations = new ShaderUniformLocations(gl, program);
    }
    return ProgramResource;
}());
var Resources = (function () {
    function Resources() {
        this.shaderSources = new KeyedCollection();
        this.shaders = new KeyedCollection();
        this.programs = new KeyedCollection();
    }
    Resources.prototype.loadShaderSource = function (name) {
        return __awaiter(this, void 0, void 0, function () {
            var res_1, source, self, res;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (this.shaderSources.containsKey(name)) {
                            res_1 = this.shaderSources.item(name);
                            return [2, res_1];
                        }
                        source = '';
                        self = this;
                        return [4, fetch("/assets/shaders/" + name, {
                                method: 'GET',
                                mode: 'cors',
                                cache: 'no-cache',
                                credentials: 'omit',
                                headers: {
                                    'content-type': 'application/json'
                                },
                                redirect: 'follow',
                                referrerPolicy: 'no-referrer',
                                body: null,
                            })
                                .then(checkFetchText)
                                .then(function (data) {
                                source = data;
                            })
                                .catch(console.error)];
                    case 1:
                        _a.sent();
                        res = new SourceResource(source);
                        this.shaderSources.add(name, res);
                        return [2, res];
                }
            });
        });
    };
    Resources.prototype.loadShader = function (gl, name, type) {
        return __awaiter(this, void 0, void 0, function () {
            var res_2, source, shader, res;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (this.shaders.containsKey(name)) {
                            res_2 = this.shaders.item(name);
                            return [2, res_2];
                        }
                        return [4, this.loadShaderSource(name)];
                    case 1:
                        source = _a.sent();
                        shader = gl.createShader(type);
                        gl.shaderSource(shader, source.source);
                        gl.compileShader(shader);
                        res = new ShaderResource(name, type, shader);
                        this.shaders.add(name, res);
                        return [2, res];
                }
            });
        });
    };
    Resources.prototype.loadProgram = function (gl, programName, vertexName, fragmentName) {
        return __awaiter(this, void 0, void 0, function () {
            var res_3, vertexShader, fragmentShader, program, res;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (this.programs.containsKey(name)) {
                            res_3 = this.programs.item(name);
                            return [2, res_3];
                        }
                        return [4, this.loadShader(gl, vertexName, gl.VERTEX_SHADER)];
                    case 1:
                        vertexShader = _a.sent();
                        return [4, this.loadShader(gl, fragmentName, gl.FRAGMENT_SHADER)];
                    case 2:
                        fragmentShader = _a.sent();
                        program = gl.createProgram();
                        gl.attachShader(program, vertexShader.shader);
                        gl.attachShader(program, fragmentShader.shader);
                        gl.linkProgram(program);
                        res = new ProgramResource(gl, vertexName, fragmentName, program);
                        this.programs.add(programName, res);
                        return [2, res];
                }
            });
        });
    };
    Resources.prototype.getProgram = function (name) {
        return this.programs.item(name);
    };
    return Resources;
}());
var Renderer = (function () {
    function Renderer() {
        this.layers = [];
        var maybePlayArea = document.getElementById(ElementIds.play_area);
        if (maybePlayArea instanceof HTMLDivElement) {
            this.playAreaDiv = maybePlayArea;
        }
        else {
            console.error('Could not find map div wrapper!');
        }
        var maybeCanvas = document.getElementById(ElementIds.play_area_canvas);
        if (maybeCanvas instanceof HTMLCanvasElement) {
            this.canvas = maybeCanvas;
        }
        else {
            console.error('Could not find map canvas!');
        }
        var maybeContext = this.canvas.getContext('webgl');
        if (maybeContext instanceof WebGLRenderingContext) {
            this.gl = maybeContext;
        }
        else {
            console.error('Unable to initialize WebGL. Your browser or machine may not support it.');
        }
        this.layers.push(Layer.default());
        var callback = this.resizeCallback.bind(this);
        this.resizeObserver = new ResizeObserver(callback);
        this.resizeObserver.observe(this.playAreaDiv);
        this.resources = new Resources;
    }
    Object.defineProperty(Renderer.prototype, "canvasWidth", {
        get: function () {
            return this.canvas.clientWidth;
        },
        set: function (w) {
            this.canvas.width = Math.floor(w);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Renderer.prototype, "canvasHeight", {
        get: function () {
            return this.canvas.clientHeight;
        },
        set: function (h) {
            this.canvas.height = Math.floor(h);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Renderer.prototype, "width", {
        get: function () {
            return this.gl.canvas.width;
        },
        set: function (w) {
            var gl = this.gl;
            var width = Math.floor(w);
            gl.canvas.width = width;
            gl.viewport(0, 0, width, this.height);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Renderer.prototype, "height", {
        get: function () {
            return this.gl.canvas.height;
        },
        set: function (h) {
            var gl = this.gl;
            var height = Math.floor(h);
            gl.canvas.height = height;
            gl.viewport(0, 0, this.width, height);
        },
        enumerable: true,
        configurable: true
    });
    Renderer.prototype.clear = function () {
        var gl = this.gl;
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    };
    Renderer.prototype.setupBuffer = function () {
        var gl = this.gl;
        gl.clearColor(0.5, 0.0, 0.0, 1.0);
        gl.clearDepth(1.0);
        gl.enable(gl.DEPTH_TEST);
        gl.depthFunc(gl.LEQUAL);
        this.clear();
        var positionBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
        var positions = [
            -1.0, 1.0,
            1.0, 1.0,
            -1.0, -1.0,
            1.0, -1.0,
        ];
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);
        var fov = 45 * Math.PI / 180;
        var aspect = this.width / this.height;
        var zNear = 0.1;
        var zFar = 100.0;
        var projectionMatrix = glMatrix.mat4.create();
        glMatrix.mat4.perspective(projectionMatrix, fov, aspect, zNear, zFar);
        var modelViewMatrix = glMatrix.mat4.create();
        glMatrix.mat4.translate(modelViewMatrix, modelViewMatrix, [0.0, 0.0, -5.0]);
        var programInfo = this.resources.getProgram('test');
        console.log(programInfo);
        {
            var numComponents = 2;
            var type = gl.FLOAT;
            var normalize = false;
            var stride = 0;
            var offset = 0;
            gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
            gl.vertexAttribPointer(programInfo.attributeLocations.vertexPosition, numComponents, type, normalize, stride, offset);
            gl.enableVertexAttribArray(programInfo.attributeLocations.vertexPosition);
        }
        gl.useProgram(programInfo.program);
        gl.uniformMatrix4fv(programInfo.uniformLocations.projectionMatrix, false, projectionMatrix);
        gl.uniformMatrix4fv(programInfo.uniformLocations.modelViewMatrix, false, modelViewMatrix);
        {
            var offset = 0;
            var vertexCount = 4;
            gl.drawArrays(gl.TRIANGLE_STRIP, offset, vertexCount);
        }
    };
    Renderer.prototype.draw = function () {
        this.clear();
    };
    Renderer.prototype.resize = function (w, h) {
        var gl = this.gl;
        var width = Math.floor(w);
        var height = Math.floor(h);
        gl.canvas.width = width;
        gl.canvas.height = height;
        gl.viewport(0, 0, width, height);
        this.clear();
    };
    Renderer.prototype.resizeCallback = function (entries) {
        var entry;
        if (entries.length > 0) {
            entry = entries[0];
        }
        else {
            return;
        }
        var width = 0;
        var height = 0;
        if (entry.contentBoxSize) {
            width = entry.contentBoxSize.inlineSize;
            height = entry.contentBoxSize.blockSize;
        }
        else {
            width = entry.contentRect.width;
            height = entry.contentRect.height;
        }
        height += 4;
        this.resize(width, height);
    };
    Renderer.prototype.loadDefaults = function () {
        return __awaiter(this, void 0, void 0, function () {
            var program;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4, this.resources.loadProgram(this.gl, 'test', 'vertex.vert', 'fragment.frag')];
                    case 1:
                        program = _a.sent();
                        return [2];
                }
            });
        });
    };
    return Renderer;
}());
//# sourceMappingURL=play_area.js.map
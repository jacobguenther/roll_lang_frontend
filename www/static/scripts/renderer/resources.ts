interface IKeyedCollection<T> {
    add(key: string, value: T): void;
    containsKey(key: string): boolean;
    count(): number;
    item(key: string): T;
    keys(): string[];
    remove(key: string): T;
    values(): T[];
}
class KeyedCollection<T> implements IKeyedCollection<T> {
    private items: { [index: string]: T } = {};
    private count_m: number = 0;

    public add(key: string, value: T) {
        if(!this.items.hasOwnProperty(key))
             this.count_m++;

        this.items[key] = value;
    }
	public containsKey(key: string): boolean {
        return this.items.hasOwnProperty(key);
    }
    public count(): number {
        return this.count_m;
    }
    public item(key: string): T {
        return this.items[key];
    }
    public keys(): string[] {
        var keySet: string[] = [];
        for (var prop in this.items) {
            if (this.items.hasOwnProperty(prop)) {
                keySet.push(prop);
            }
        }
        return keySet;
	}
    public remove(key: string): T {
        var val = this.items[key];
        delete this.items[key];
        this.count_m--;
        return val;
    }
    public values(): T[] {
        var values: T[] = [];
        for (var prop in this.items) {
            if (this.items.hasOwnProperty(prop)) {
                values.push(this.items[prop]);
            }
        }
        return values;
    }
}





class SourceResource {
	public source: string;
	constructor(source: string) {
		this.source = source;
	}
}
class ShaderResource {
	public sourceName: string;
	public type: number;
	public shader: WebGLShader;

	constructor(sourceName: string, type: number, shader: WebGLShader) {
		this.sourceName = sourceName;
		this.type = type;
		this.shader = shader;
	}
}
class ShaderAttributeLocations {
	vertexPosition: number;
	vertexColor: number;
	textureCoord: number;

	constructor(gl: WebGLRenderingContext, shaderProgram: WebGLProgram) {
		this.vertexPosition = gl.getAttribLocation(shaderProgram, 'aVertexPosition');
		this.vertexColor = gl.getAttribLocation(shaderProgram, 'aVertexColor');
		this.textureCoord = gl.getAttribLocation(shaderProgram, 'aTextureCoord');
	}
}
class ImageResource {
	path: string;
	license: string;
	sizeX: number;
	sizeY: number;
	texture: WebGLTexture;
	constructor(path: string, image: HTMLImageElement, texture: WebGLTexture) {
		this.path = path;
		this.sizeX = image.width;
		this.sizeY = image.height;
		this.texture = texture;
	}
}
class ShaderUniformLocations {
	projectionMatrix: WebGLUniformLocation;
	modelMatrix: WebGLUniformLocation;
	viewMatrix: WebGLUniformLocation;

	sampler: WebGLUniformLocation;
	mixFactor: WebGLUniformLocation;
	gridColor: WebGLUniformLocation;

	constructor(gl: WebGLRenderingContext, shaderProgram: WebGLProgram) {
		this.projectionMatrix = gl.getUniformLocation(shaderProgram, 'uProjectionMatrix');
		this.viewMatrix = gl.getUniformLocation(shaderProgram, 'uViewMatrix');
		this.modelMatrix = gl.getUniformLocation(shaderProgram, 'uModelMatrix');

		this.sampler = gl.getUniformLocation(shaderProgram, 'uSampler');
		this.mixFactor = gl.getUniformLocation(shaderProgram, 'uMixFactor');

		this.gridColor = gl.getUniformLocation(shaderProgram, 'uGridColor');
	}
}
class ProgramResource {
	public vertexSourceName: string;
	public fragmentSourceName: String;
	public program: WebGLProgram;
	public attributeLocations: ShaderAttributeLocations;
	public uniformLocations: ShaderUniformLocations;
	constructor(
		gl: WebGLRenderingContext,
		vertexSourceName: string,
		fragmentSourceName: string,
		program: WebGLProgram)
	{
		this.vertexSourceName = vertexSourceName;
		this.fragmentSourceName = fragmentSourceName;
		this.program = program;
		this.attributeLocations = new ShaderAttributeLocations(gl, program);
		this.uniformLocations = new ShaderUniformLocations(gl, program);
	}
}
class Resources {
	private shaderSources: KeyedCollection<SourceResource> = new KeyedCollection<SourceResource>();
	private shaders: KeyedCollection<ShaderResource> = new KeyedCollection<ShaderResource>();
	private programs: KeyedCollection<ProgramResource> = new KeyedCollection<ProgramResource>();
	private images: KeyedCollection<ImageResource> = new KeyedCollection<ImageResource>();

	async loadShaderSource(name: string): Promise<SourceResource> {
		if (this.shaderSources.containsKey(name)) {
			const res = this.shaderSources.item(name);
			return res;
		}

		const source = await fetchShader(name);

		const res = new SourceResource(source);
		this.shaderSources.add(name, res);
		return res;
	}
	async loadShader(gl: WebGLRenderingContext, name: string, type: number): Promise<ShaderResource> {
		if (this.shaders.containsKey(name)) {
			const res = this.shaders.item(name);
			return res;
		}
		const source = await this.loadShaderSource(name);
		const shader = gl.createShader(type);
		gl.shaderSource(shader, source.source);
		gl.compileShader(shader);

		// validate compile status
		const message = gl.getShaderInfoLog(shader);
		if (message.length > 0) {
			Promise.reject(message);
		}

		const res = new ShaderResource(name, type, shader);
		this.shaders.add(name, res);
		return res;
	}
	async loadProgram(gl: WebGLRenderingContext, programName: string, vertexName: string, fragmentName: string): Promise<ProgramResource> {
		if (this.programs.containsKey(name)) {
			const res = this.programs.item(name);
			return res;
		}
		const vertexShader = await this.loadShader(gl, vertexName, gl.VERTEX_SHADER);
		const fragmentShader = await this.loadShader(gl, fragmentName, gl.FRAGMENT_SHADER);

		const program = gl.createProgram();
		gl.attachShader(program, vertexShader.shader);
		gl.attachShader(program, fragmentShader.shader);
		gl.linkProgram(program);

		// validate link status?

		const res = new ProgramResource(gl, vertexName, fragmentName, program);
		this.programs.add(programName, res)
		return res;
	}
	async loadImage(gl: WebGLRenderingContext, name: string, path: string): Promise<ImageResource> {
		if (this.images.containsKey(name)) {
			const res = this.images.item(name);
			return res;
		}

		let self = this;
		return await fetchImage(path)
			.then((imageURL: string) => {
				return new Promise(function(resolve: any, reject: any) {
					const image = new Image();
					image.onload = () => { resolve({blobURL: imageURL, element: image}) };
					image.onerror = () => { reject() };
					image.src = imageURL;
				});
			})
			.then((image: {blobURL: string, element: HTMLImageElement}) => {
				URL.revokeObjectURL(image.blobURL);

				const texture = gl.createTexture();
				gl.bindTexture(gl.TEXTURE_2D, texture);
				gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
				gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
				gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
				gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
				gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image.element);

				const res = new ImageResource(path, image.element, texture);
				self.images.add(name, res);
				return Promise.resolve(res);
			});
	}


	getProgram(name: string): ProgramResource {
		return this.programs.item(name);
	}
	getImage(name: string): ImageResource {
		return this.images.item(name);
	}
}

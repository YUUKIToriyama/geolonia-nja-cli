#!/usr/bin/env node
import * as Caporal from '@caporal/core';
import { reverseGeocoder } from './lib';

import { updateDatabase } from './update';
import { normalizeAddress } from './normalize';

import fs from "fs";
const { version } = JSON.parse(fs.readFileSync(__dirname + "/../package.json").toString("utf8"));

Caporal.program
	.name("@toriyama/geolonian")
	.version(version)
	.description("@geolonia/normalize-japanese-addressesをコンソール上で簡単にテストするためのモジュール");


Caporal.program
	.command("update", "Download address database")
	.action(() => {
		updateDatabase();
	});

Caporal.program
	.command("normalize", "Normalize an address")
	.option("-a, --address <address>", "Address")
	.option("-l, --level <depth>", "Depth of normalization", {
		default: 3
	})
	.option("--use-local", "Use local data source", {
		default: false
	})
	.action(({ options }) => {
		normalizeAddress({
			address: options.address as string,
			level: options.level as number,
			useLocalSource: options.useLocal as boolean
		});
	});

Caporal.program
	.command("reverse-geocoder", "Get address from geographic coordinates")
	.argument("<longitude>", "緯度と経度の間は半角スペースで区切る必要があります。", {
		validator: Caporal.program.NUMBER,
		default: 0
	})
	.argument("<latitude>", "緯度と経度の間は半角スペースで区切る必要があります。", {
		validator: Caporal.program.NUMBER,
		default: 0
	})
	.option("--lat <latitude>", "緯度を入力してください。", {
		validator: Caporal.program.NUMBER,
		required: false
	})
	.option("--lng <longitude>", "経度を入力してください。", {
		validator: Caporal.program.NUMBER,
		required: false
	})
	.action(({ options, args }) => {
		// 引数で緯度・経度を指定した場合
		// 呼び出し例: geolonian reverse-geocoder 139.7673068 35.6809591
		if (args.longitude !== 0 && args.latitude !== 0) {
			reverseGeocoder(args.longitude as number, args.latitude as number);
		} else {
			// キーワード引数で緯度、経度をそれぞれ指定した場合
			// 呼び出し例: geolonian reverse-geocoder --lat 139.7673068 --lng 35.6809591
			if (options.lat !== undefined && options.lng !== undefined) {
				reverseGeocoder(options.lat as number, options.lng as number);
			}
		}
	})


Caporal.program.run();
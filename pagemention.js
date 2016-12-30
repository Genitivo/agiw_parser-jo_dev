var unique = require('array-unique');

module.exports = function(callback){

	var text = callback.text;
	var pe = callback.pe;
	var seeds = callback.seeds;
	var synonyms = callback.synonyms;
	var keywords = [];
	keywords = keywords.concat(pe);
	keywords = keywords.concat(seeds);
	keywords = keywords.concat(synonyms);

	keywords = unique(keywords);


	let wiki_docs = [];

	//console.log('TESTO PRE TAG:\n'+text.join('\n'));


	for(i in text){
		//wiki_docs.push({id:docs_list[i].id, text:[] });

		//console.log('paragraph PRE:\n'+paragraph);

		for (j in keywords){

			var tag;

			if(pe.indexOf(keywords[j])!=-1)
					tag = '<PE>';
			else{
				if(seeds.indexOf(keywords[j])!=-1)
					tag = '<SEED>';
				else
					tag = '<SYNONYM>';
			}

			// let pe_regex = new RegExp(docs_list[i].pe.join(' | '),'ig');
			// let seeds_regex = new RegExp(docs_list[i].seeds.join('|'), 'ig');
			// let synonyms_regex = new RegExp(docs_list[i].synonyms.join('|'), 'ig');
			//
			// let matching = [];
			//
			// //matching.push('\nPE');
			// matching = (paragraph.match(pe_regex) !== null) ? matching.concat(paragraph.match(pe_regex)) : matching;
			// //matching.push('SEEDS');
			// matching = (paragraph.match(seeds_regex) !== null) ? matching.concat(paragraph.match(seeds_regex)) : matching;
			// //matching.push('SYNONYMS');
			// matching = (paragraph.match(synonyms_regex) !== null) ? matching.concat(paragraph.match(synonyms_regex)) : matching;
			//
			//
			// paragraph = paragraph.replace(pe_regex, '<PE>');
			// paragraph = paragraph.replace(seeds_regex, '<SEED>');
			// paragraph = paragraph.replace(synonyms_regex, '<SYNONYM>');

			if(text[i].indexOf('<PE>')==-1){
				var reg = new RegExp("[^a-zA-Z]"+keywords[j]+"[^a-zA-Z]","g");

				text[i] = text[i].replace(reg,function(match){
					//console.log("MATCH: "+match);
					return match.charAt(0)+tag+keywords[j]+tag+match.charAt(match.length-1);
				});
	}

			//
			// if(matching.length !== 0){
			// 	wiki_docs[i].text.push(paragraph);
			// 	matching_in_doc= matching_in_doc.concat(matching);
			// 	console.log('--'+paragraph);
			// }

		}
		//wiki_docs[i].mentions = matching_in_doc;

	}

	var testo = text.join('\n');
	let count_pe = (testo.match(/<PE>/g) || []).length /2;
	let count_seeds = (testo.match(/<SEED>/g) || []).length /2;
	let count_syn = (testo.match(/<SYNONYM>/g) || []).length /2;

	callback.text = text;
	//console.log('TESTO POST TAG:\n'+testo);

	let callback_obj = {id: callback.id, primary_entity: count_pe, seeds: count_seeds, syn: count_syn};

	return callback_obj;
	//console.log("PE: "+count_pe+"\nSEEDS: "+count_seeds+"\nSYNONYMS: "+count_syn);

	//callback(wiki_docs);
}

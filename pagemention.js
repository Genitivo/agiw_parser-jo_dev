var unique = require('array-unique');

module.exports = function(articolo){

	var text = articolo.text;
	var pe = articolo.pe;
	var seeds = articolo.seeds;
	var synonyms = articolo.synonyms;
	var keywords = [];
	keywords = keywords.concat(pe);
	keywords = keywords.concat(seeds);
	keywords = keywords.concat(synonyms);

	keywords = unique(keywords);

	var texto = [];


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

			if(tag === '<PE>'){
				var reg = new RegExp("[^a-zA-Z]"+keywords[j]+"[^a-zA-Z]","ig");

				text[i] = text[i].replace(reg, function(match){

					if(match=='' && text[i].indexOf(match)==0){
						return tag+keywords[j]+tag;
					}
					if(text[i].indexOf('[[')!==-1 && (text[i].indexOf(match)+1 > (text[i].indexOf('[[')+2) ) && (text[i].indexOf(match) < (text[i].indexOf(']]')+2) ) ) {
						return match;
					}
					else
						return match.charAt(0)+tag+keywords[j]+tag+match.charAt(match.length-1);
				});
			}
			else if(tag === '<SEED>' || tag === '<SYNONYM>') {

				if(text[i].indexOf('<PE>')==-1 && tag === '<SEED>' || text[i].indexOf('<PE>')==-1 && text[i].indexOf('<SEED>')==-1 && tag === '<SYNONYM>'){
				var reg = new RegExp("The "+keywords[j]+"[^a-zA-Z]","ig");

				text[i] = text[i].replace(reg,function(match){
					if(text[i].indexOf('[[')!==-1 && text[i].indexOf(match) > text[i].indexOf('[[') && text[i].indexOf(match) < text[i].indexOf(']]')) {
						return match;
					}
					else
						return 'The '+tag+keywords[j]+tag+match.charAt(match.length-1);
				});
			}

		}

			//
			// if(matching.length !== 0){
			// 	wiki_docs[i].text.push(paragraph);
			// 	matching_in_doc= matching_in_doc.concat(matching);
			// 	console.log('--'+paragraph);
			// }

		}
		let count_pe = (text[i].match(/<PE>/g) || []).length /2;
		let count_seeds = (text[i].match(/<SEED>/g) || []).length /2;
		let count_syn = (text[i].match(/<SYNONYM>/g) || []).length /2;

		if((count_pe+count_seeds+count_syn)>0){
			texto.push(text[i]);
		}
		//wiki_docs[i].mentions = matching_in_doc;

	}


	var testo = texto.join('\n');
	let count_pe = (testo.match(/<PE>/g) || []).length /2;
	let count_seeds = (testo.match(/<SEED>/g) || []).length /2;
	let count_syn = (testo.match(/<SYNONYM>/g) || []).length /2;

	articolo.text = texto;

	let articolo_obj = {id: articolo.id, keywords: keywords, primary_entity: count_pe, seeds: count_seeds, syn: count_syn};

	return articolo_obj;

	//articolo(wiki_docs);
}

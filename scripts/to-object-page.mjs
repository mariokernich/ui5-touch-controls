/**
 * One-off migration: rewrites the page of a control from a sap.m.Page filled
 * with a row of sap.f.Cards to a sap.uxap.ObjectPageLayout.
 *
 * The page keeps everything it showed - the same options, the same two demo
 * columns and the same code snippets - only the frame around it changes:
 *
 *   ControlIntro fragment  -> the header of the object page
 *   card "options"         -> column 1 of the playground section
 *   card "the touch one"   -> column 2
 *   card "the original"    -> column 3
 *   ExampleCard fragment   -> the Example Usage section
 *
 * The script is deliberately strict: a page that does not match the expected
 * shape is reported and left alone rather than half converted.
 *
 * Usage: node scripts/to-object-page.mjs CheckBox RadioButton ...
 */
import { readFileSync, writeFileSync } from "node:fs";

/** pulls the body out of one <f:Card>…</f:Card>, without its header */
function splitCards(xml) {
	const cards = [];
	const open = /<f:Card\b[^>]*>/g;
	let m;

	while ((m = open.exec(xml))) {
		// find the matching close tag, counting nested cards (there are none
		// today, but a wrong slice would be silent damage)
		let depth = 1;
		let index = open.lastIndex;
		const tag = /<(\/?)f:Card\b/g;
		tag.lastIndex = index;
		let t;

		while (depth > 0 && (t = tag.exec(xml))) {
			depth += t[1] ? -1 : 1;
			index = t.index;
		}

		cards.push(xml.slice(m.index, xml.indexOf(">", tag.lastIndex) + 1));
	}

	return cards;
}

/** the <f:content> of a card, with the wrapping VBox of margins removed */
function cardContent(card) {
	const content = card.match(/<f:content>([\s\S]*?)<\/f:content>/);

	if (!content) {
		throw new Error("card without content");
	}

	let body = content[1];
	// the content of every card is a VBox that only carries the margins the
	// card needs; in a section those margins are wrong, so the box goes
	const outer = body.match(
		/^\s*<VBox\b[^>]*class="[^"]*sapUiSmallMarginBegin[^"]*"[^>]*>([\s\S]*)<\/VBox>\s*$/,
	);

	if (outer) {
		body = outer[1];
	}

	return body;
}

/** shifts a block of markup to a new indentation */
function reindent(block, spaces) {
	const lines = block.replace(/^\n+|\s+$/g, "").split("\n");
	const base = Math.min(
		...lines.filter((l) => l.trim()).map((l) => l.match(/^\t*/)[0].length),
	);

	return lines
		.map((l) => (l.trim() ? "\t".repeat(spaces) + l.slice(base) : ""))
		.join("\n");
}

function convert(name) {
	const path = `docs/view/${name}.view.xml`;
	const xml = readFileSync(path, "utf8");

	if (xml.includes("ObjectPageLayout")) {
		return `${name}: already an object page, skipped`;
	}

	const cards = splitCards(xml);

	if (cards.length !== 3) {
		throw new Error(`${name}: expected 3 cards, found ${cards.length}`);
	}

	const [options, touch, original] = cards.map(cardContent);

	const view = `<mvc:View
	controllerName="ui5.touch.controls.demo.controller.${name}"
	xmlns="sap.m"
	xmlns:mvc="sap.ui.core.mvc"
	xmlns:core="sap.ui.core"
	xmlns:editor="sap.ui.codeeditor"
	xmlns:uxap="sap.uxap"
	xmlns:tc="ui5.touch.controls"
	height="100%">
	<!-- The page of a control is an ObjectPageLayout: the anchor bar names the
	     parts of the page - Overview, Playground, Example Usage - and jumps to
	     them, which a row of cards cannot do.

	     The head of the page reads like an entry of the demo kit: the name of
	     the control, one or two sentences on what it is, and beside them the
	     facts about the class - what it extends, since when it is there and
	     how visible it is. -->
	<uxap:ObjectPageLayout
		id="objectPage"
		upperCaseAnchorBar="false"
		class="touchControlsPage touchControlsObjectPage">
		<!-- showTitleInHeaderContent is left off on purpose: it repeats the
		     title and subtitle of the header title inside the header content,
		     so the head of the page would say the same thing twice -->
		<uxap:headerTitle>
			<uxap:ObjectPageHeader
				objectTitle="{control>/fullName}"
				objectSubtitle="{control>/summary}" />
		</uxap:headerTitle>

		<uxap:headerContent>
			<!-- the facts about the class, the way the demo kit lists them -->
			<ObjectAttribute title="{i18n>introExtends}">
				<customContent>
					<Link
						text="{control>/extendsClass}"
						href="{control>/extendsUrl}"
						target="_blank"
						enabled="{= !!\${control>/extendsUrl} }" />
				</customContent>
			</ObjectAttribute>
			<ObjectAttribute title="{i18n>introSince}" text="{control>/since}" />
			<ObjectAttribute
				title="{i18n>introVisibility}"
				text="{control>/visibility}" />
			<!-- the one place the link to the original lives; the sections
			     below do not repeat it -->
			<Link
				text="{i18n>introDocLink}"
				href="{control>/docUrl}"
				target="_blank" />
		</uxap:headerContent>

		<uxap:sections>
			<!-- Overview: what the sap.m original is and what this library made
			     of it, the two next to each other -->
			<uxap:ObjectPageSection title="{i18n>sectionOverview}">
				<uxap:subSections>
					<uxap:ObjectPageSubSection>
						<uxap:blocks>
							<HBox width="100%" wrap="Wrap" class="touchControlsCardRow">
								<VBox>
									<layoutData>
										<FlexItemData growFactor="1" baseSize="0" />
									</layoutData>
									<Title
										text="{i18n>introOriginal}"
										level="H3"
										wrapping="true" />
									<Text
										text="{control>/replaces}"
										class="sapUiTinyMarginTop" />
									<Text
										text="{control>/original}"
										class="sapUiTinyMarginTop" />
								</VBox>
								<VBox>
									<layoutData>
										<FlexItemData growFactor="1" baseSize="0" />
									</layoutData>
									<Title
										text="{i18n>introTouch}"
										level="H3"
										wrapping="true" />
									<Text
										text="{control>/fullName}"
										class="sapUiTinyMarginTop" />
									<Text
										text="{control>/description}"
										class="sapUiTinyMarginTop" />
									<Text
										text="{i18n>introSizeNote}"
										class="sapUiTinyMarginTop" />
								</VBox>
							</HBox>
						</uxap:blocks>
					</uxap:ObjectPageSubSection>
				</uxap:subSections>
			</uxap:ObjectPageSection>

			<!-- Playground: one block, three columns - what can be set, the
			     control of this library, and the sap.m original beside it -->
			<uxap:ObjectPageSection title="{i18n>sectionPlayground}">
				<uxap:subSections>
					<uxap:ObjectPageSubSection>
						<uxap:blocks>
							<HBox
								width="100%"
								wrap="Wrap"
								class="touchControlsCardRow touchControlsPlaygroundRow">
								<!-- column 1: what can be set -->
								<VBox>
									<layoutData>
										<FlexItemData growFactor="1" baseSize="0" />
									</layoutData>
									<Title
										text="{i18n>optionsTitle}"
										level="H3"
										wrapping="true"
										class="sapUiTinyMarginBottom" />
${reindent(options, 9)}
								</VBox>

								<!-- column 2: the library control -->
								<VBox>
									<layoutData>
										<FlexItemData growFactor="1" baseSize="0" />
									</layoutData>
									<Title
										text="{control>/fullName}"
										level="H3"
										wrapping="true" />
									<Text
										text="{i18n>cardTouch}"
										class="sapUiTinyMarginBottom" />
${reindent(touch, 9)}
								</VBox>

								<!-- column 3: the sap.m original -->
								<VBox>
									<layoutData>
										<FlexItemData growFactor="1" baseSize="0" />
									</layoutData>
									<Title
										text="{control>/replaces}"
										level="H3"
										wrapping="true" />
									<Text
										text="{i18n>cardOriginal}"
										class="sapUiTinyMarginBottom" />
${reindent(original, 9)}
								</VBox>
							</HBox>
						</uxap:blocks>
					</uxap:ObjectPageSubSection>
				</uxap:subSections>
			</uxap:ObjectPageSection>

			<!-- Example Usage: the snippets come from the "example" model, not
			     from the view - curly braces in an XML view would be parsed as
			     binding syntax -->
			<uxap:ObjectPageSection title="{i18n>sectionExample}">
				<uxap:subSections>
					<uxap:ObjectPageSubSection>
						<uxap:blocks>
							<VBox width="100%" items="{example>/main}">
								<VBox width="100%">
									<Title
										text="{= \${example>title} || (\${example>language} === 'xml' ? \${i18n>exampleUsageXml} : \${i18n>exampleUsageController}) }"
										level="H3"
										wrapping="true"
										class="sapUiTinyMarginBottom" />
									<editor:CodeEditor
										value="{example>code}"
										type="{example>language}"
										height="{example>height}"
										width="100%"
										editable="false"
										lineNumbers="true" />
								</VBox>
							</VBox>
						</uxap:blocks>
					</uxap:ObjectPageSubSection>
				</uxap:subSections>
			</uxap:ObjectPageSection>
		</uxap:sections>
	</uxap:ObjectPageLayout>
</mvc:View>
`;

	writeFileSync(path, view);
	return `${name}: converted`;
}

for (const name of process.argv.slice(2)) {
	try {
		console.log(convert(name));
	} catch (error) {
		console.log(`${name}: FAILED - ${error.message}`);
	}
}

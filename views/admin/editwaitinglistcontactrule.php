<?php /* DEPRECATED */ ?>
<?php
/**
 * OpenEyes
 *
 * (C) Moorfields Eye Hospital NHS Foundation Trust, 2008-2011
 * (C) OpenEyes Foundation, 2011-2012
 * This file is part of OpenEyes.
 * OpenEyes is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version.
 * OpenEyes is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU General Public License for more details.
 * You should have received a copy of the GNU General Public License along with OpenEyes in a file titled COPYING. If not, see <http://www.gnu.org/licenses/>.
 *
 * @package OpenEyes
 * @link http://www.openeyes.org.uk
 * @author OpenEyes <info@openeyes.org.uk>
 * @copyright Copyright (c) 2008-2011, Moorfields Eye Hospital NHS Foundation Trust
 * @copyright Copyright (c) 2011-2012, OpenEyes Foundation
 * @license http://www.gnu.org/licenses/gpl-3.0.html The GNU General Public License V3.0
 */

?>
<div class="curvybox white">
	<div class="admin">
		<h3 class="georgia"><?php echo $rule->id ? 'Edit' : 'Add'?> waiting list contact rule</h3>
		<?php echo $this->renderPartial('//admin/_form_errors',array('errors'=>$errors))?>
		<div>
			<?php
			$form = $this->beginWidget('BaseEventTypeCActiveForm', array(
				'id'=>'adminform',
				'enableAjaxValidation'=>false,
				'htmlOptions' => array('class'=>'sliding'),
				'focus'=>'#contactname'
			))?>
			<?php echo $form->dropDownList($rule,'parent_rule_id',CHtml::listData(OphTrOperationbooking_Waiting_List_Contact_Rule::model()->getListAsTree(),'id','treeName'),array('empty'=>'- None -'))?>
			<?php echo $form->textField($rule,'rule_order')?>
			<?php echo $form->dropDownList($rule,'site_id',CHtml::listData(Site::model()->findAll(array('order'=>'name asc','condition'=>'institution_id = 1')),'id','name'),array('empty'=>'- Not set -'))?>
			<?php echo $form->dropDownList($rule,'firm_id',Firm::model()->getListWithSpecialties(),array('empty'=>'- Not set -'))?>
			<?php echo $form->dropDownList($rule,'service_id',CHtml::listData(Service::model()->findAll(array('order'=>'name')),'id','name'),array('empty'=>'- Not set -'))?>
			<?php echo $form->textField($rule,'name')?>
			<?php echo $form->textField($rule,'telephone')?>
			<?php $this->endWidget()?>
		</div>
		<?php if ($rule->children) {?>
			<div>
				<p style="font-size: 13px; margin: 0; padding: 0; margin-top: 10px; margin-bottom: 10px;"><strong>Descendants</strong></p>
				<?php
				$this->widget('CTreeView',array(
					'data' => OphTrOperationbooking_Waiting_List_Contact_Rule::model()->findAllAsTree($rule,true,'textPlain'),
				))?>
			</div>
		<?php }?>
	</div>
</div>
<?php echo $this->renderPartial('//admin/_form_errors',array('errors'=>$errors))?>
<div>
	<?php echo EventAction::button('Save', 'save', array('colour' => 'green'))->toHtml()?>
	<?php echo EventAction::button('Cancel', 'cancel', array('colour' => 'red'))->toHtml()?>
	<?php if ($rule->id) echo EventAction::button('Delete', 'delete', array('colour' => 'blue'))->toHtml()?>
	<img class="loader" src="<?php echo Yii::app()->createUrl('/img/ajax-loader.gif')?>" alt="loading..." style="display: none;" />
</div>
<script type="text/javascript">
	handleButton($('#et_cancel'),function() {
		window.location.href = baseUrl+'/OphTrOperationbooking/admin/view'+OE_rule_model+'s';
	});
	handleButton($('#et_save'),function() {
		$('#adminform').submit();
	});
	handleButton($('#et_delete'),function() {
		window.location.href = baseUrl+'/OphTrOperationbooking/admin/delete'+OE_rule_model+'/<?php echo $rule->id?>';
	});
</script>
